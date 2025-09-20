import { getParkingSlotsAsync } from "../services/admin.service.js";

export const getParkingSlots = async (req, res, next) => {
    const data = await getParkingSlotsAsync();
    res.status(200).json({ data });
};