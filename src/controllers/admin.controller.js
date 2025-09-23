import { cancelBookingSlotAsync, checkInAsync, checkOutAsync, creatUserAsync, deleteUserAsync, getParkingRecordsAsync, getParkingSlotsAsync, getUserAsync, updateUserAsync } from "../services/admin.service.js";

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

export const getParkingRecords = async (req, res, next) => {
    const { page, limit, search, parkingRecordId, status, userId, parkingSlotId, sortBy, sortOrder } = req.query;

    const result = await getParkingRecordsAsync({ page, limit, search, parkingRecordId, status, userId, parkingSlotId, sortBy, sortOrder });

    return res.status(200).json({
        ...result
    });
};

export const getUsers = async (req, res, next) => {
    const { page, limit, username, name, email, phone, role, sortBy, sortOrder } = req.query;

    const result = await getUserAsync({ page, limit, username, name, email, phone, role, sortBy, sortOrder });

    return res.status(200).json({
        ...result
    });
};

export const createUser = async (req, res, next) => {
    const { username, password, name, email, phone, role } = req.body;

    const data = await creatUserAsync({ username, password, name, email, phone, role });
    res.status(201).json({ data });
};

export const updateUser = async (req, res, next) => {
    const { username, password, name, email, phone, role } = req.body;
    const { id } = req.params;

    const data = await updateUserAsync({ id, username, password, name, email, phone, role });
    res.status(200).json({ data });
};

export const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    const data = await deleteUserAsync({ id });
    res.sendStatus(204);
};