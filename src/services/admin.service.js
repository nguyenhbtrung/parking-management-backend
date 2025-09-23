import { Op } from "sequelize";
import { AppError } from "../errors/appError.js";
import { SlotNotBooked, SlotNotCheckedIn, SlotNotExistError, SlotOccupiedError, UserNotFoundError } from "../errors/index.js";
import { ParkingRecord, ParkingSlot, sequelize, User } from "../models/index.js";
import { hash } from "bcryptjs";

export const getParkingSlotsAsync = async () => {
    const parkingSlot = await ParkingSlot.findAll();
    return parkingSlot;
};

export const checkInAsync = async ({ slotId, licensePlate, userId }) => {
    const slot = await ParkingSlot.findByPk(slotId);
    if (!slot)
        throw new SlotNotExistError();

    if (slot.status === "occupied")
        throw new SlotOccupiedError();

    const t = await sequelize.transaction();

    try {
        slot.status = "occupied";
        slot.licensePlate = licensePlate;
        await slot.save({ transaction: t });

        let parkingRecord = await ParkingRecord.findOne({
            where: {
                parkingSlotId: slotId,
                status: "booked",
            },
            order: [['createdAt', 'DESC']],
        });

        const now = new Date();
        if (!parkingRecord) {
            parkingRecord = await ParkingRecord.create({
                licensePlate,
                status: "checked-in",
                bookingTime: now,
                checkInTime: now,
                parkingSlotId: slotId,
                userId,
            }, {
                transaction: t
            });
        } else {
            parkingRecord.licensePlate = licensePlate;
            parkingRecord.status = "checked-in";
            parkingRecord.checkInTime = now;
            parkingRecord.parkingSlotId = slotId;
            await parkingRecord.save({ transaction: t });
        }

        await t.commit();

        return slot;
    } catch (error) {
        await t.rollback();
        throw error;
    }

};

export const checkOutAsync = async ({ slotId }) => {
    const slot = await ParkingSlot.findByPk(slotId);
    if (!slot)
        throw new SlotNotExistError();

    if (slot.status !== "occupied")
        throw new SlotNotCheckedIn();

    const t = await sequelize.transaction();

    try {
        slot.status = "available";
        slot.licensePlate = null;
        await slot.save({ transaction: t });

        await ParkingRecord.update({
            status: "check-out",
            checkOutTime: new Date(),
        }, {
            where: {
                parkingSlotId: slotId,
                status: "checked-in",
            },
            transaction: t
        });

        await t.commit();

        return slot;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const cancelBookingSlotAsync = async ({ slotId }) => {
    const slot = await ParkingSlot.findByPk(slotId);
    if (!slot)
        throw new SlotNotExistError();

    if (slot.status !== "booked")
        throw new SlotNotBooked();

    const t = await sequelize.transaction();

    try {
        slot.status = "available";
        slot.licensePlate = null;
        await slot.save({ transaction: t });

        await ParkingRecord.update({
            status: "cancelled",
        }, {
            where: {
                parkingSlotId: slotId,
                status: "booked",
            },
            transaction: t
        });

        await t.commit();

        return slot;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const getParkingRecordsAsync = async ({
    page = 1,
    limit = 10,
    search = "",
    parkingRecordId,
    status,
    userId,
    parkingSlotId,
    sortBy = "createdAt",
    sortOrder = "DESC"
}) => {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
        where.licensePlate = { [Op.like]: `%${search}%` };
    }

    if (parkingRecordId) {
        where.id = parkingRecordId;
    }

    if (status) {
        where.status = status;
    }

    if (userId) {
        where.userId = userId;
    }

    if (parkingSlotId) {
        where.parkingSlotId = parkingSlotId;
    }

    const { rows, count } = await ParkingRecord.findAndCountAll({
        where,
        offset,
        limit,
        order: [[sortBy, sortOrder]],
        include: [
            { model: User, as: "user", attributes: ["id", "username", "name", "phone", "email"] },
        ]
    });

    return {
        data: rows,
        pagination: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / limit),
        }
    };
};

export const getUserAsync = async ({
    page = 1,
    limit = 10,
    username,
    name,
    email,
    phone,
    role,
    sortBy = "createdAt",
    sortOrder = "DESC"
}) => {
    const offset = (page - 1) * limit;

    const where = {};

    if (username) {
        where.username = { [Op.like]: `%${username}%` };
    }

    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }

    if (email) {
        where.email = { [Op.like]: `%${email}%` };
    }

    if (phone) {
        where.phone = { [Op.like]: `%${phone}%` };
    }

    if (role) {
        where.role = role;
    }

    const { rows, count } = await User.findAndCountAll({
        attributes: ["id", "username", "name", "email", "phone", "role"],
        where,
        offset,
        limit,
        order: [[sortBy, sortOrder]],
    });

    return {
        data: rows,
        pagination: {
            total: count,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(count / limit),
        }
    };
};

export const creatUserAsync = async ({ username, password, name, email, phone, role }) => {
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
    });

    if (existingUser) {
        const duplicatedField = existingUser.username === username ? 'username' : 'email';
        throw new AppError(
            `${duplicatedField} already exists`,
            duplicatedField === 'email' ? 'DUPLICATE_EMAIL' : 'DUPLICATE_USERNAME',
            409,
            { [duplicatedField]: `${duplicatedField} already exists` }
        );
    }

    const passwordHash = await hash(password, 10);
    const newUser = await User.create({
        username,
        passwordHash,
        email,
        name,
        phone,
        role
    });
    const user = {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
    };
    return user;
};

export const updateUserAsync = async ({ id, username, password, name, email, phone, role }) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new UserNotFoundError();
    }

    if (username) {
        user.username = username;
    }

    if (password) {
        const passwordHash = await hash(password, 10);
        user.passwordHash = passwordHash;
    }

    if (name) {
        user.name = name;
    }

    if (email) {
        user.email = email;
    }

    if (phone) {
        user.phone = phone;
    }

    if (role) {
        user.role = role;
    }

    await user.save();

    return {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    };
};

export const deleteUserAsync = async ({ id }) => {
    await User.destroy({
        where: {
            id
        },
    });
};