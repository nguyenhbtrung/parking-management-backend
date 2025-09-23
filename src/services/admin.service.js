import { Op } from "sequelize";
import { AppError } from "../errors/appError.js";
import { SlotNotBooked, SlotNotCheckedIn, SlotNotExistError, SlotOccupiedError } from "../errors/index.js";
import { ParkingRecord, ParkingSlot, sequelize, User } from "../models/index.js";

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