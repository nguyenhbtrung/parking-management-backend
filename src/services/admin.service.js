import { ParkingSlot } from "../models/index.js";

export const getParkingSlotsAsync = async () => {
    const parkingSlot = await ParkingSlot.findAll();
    return parkingSlot;
};