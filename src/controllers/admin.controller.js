import { cancelBookingSlotAsync, checkInAsync, checkOutAsync, getParkingSlotsAsync } from "../services/admin.service.js";

export const getParkingSlots = async (req, res, next) => {
    const data = await getParkingSlotsAsync();
    res.status(200).json({ data });
};

export const checkIn = async (req, res, next) => {
    const { slotId } = req.params;
    const { licensePlate } = req.body;
    const { id } = req.user;

    const data = await checkInAsync({ slotId, licensePlate, userId: id });
    res.status(200).json({ data });
};

export const checkOut = async (req, res, next) => {
    const { slotId } = req.params;

    const data = await checkOutAsync({ slotId });
    res.status(200).json({ data });
};

export const cancelBookingSlot = async (req, res, next) => {
    const { slotId } = req.params;

    const data = await cancelBookingSlotAsync({ slotId });
    res.status(200).json({ data });
};