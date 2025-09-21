import { AppError } from "../errors/appError.js";
import { SlotNotExistError, SlotOccupiedError } from "../errors/index.js";
import { ParkingRecord, ParkingSlot, sequelize } from "../models/index.js";

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

        return { slot, parkingRecord };
    } catch (error) {
        await t.rollback();
        throw error;
    }

};