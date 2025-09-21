import {
  getBookingsAsync,
  getUserProfileAsync,
  bookingAsync,
  cancelBookingAsync,
  getSlotInfoAsync,
} from "../services/user.service.js";

export const getUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  const data = await getUserProfileAsync(userId);
  res.status(200).json({ data });
};

export const booking = async (req, res, next) => {
  const { bookingTime, parkingSlotId } = req.body;
  const userId = req.user.id;
  const data = await bookingAsync({
    bookingTime,
    parkingSlotId,
    userId,
  });
  res.status(201).json({ data });
};

export const getBookings = async (req, res, next) => {
  const userId = req.user.id;
  const data = await getBookingsAsync(userId);
  res.status(200).json({ data });
};

export const cancelBooking = async (req, res, next) => {
  const userId = req.user.id;
  const data = await cancelBookingAsync(userId);
  res.status(200).json({ data });
};

export const getParkingSlots = async (req, res, next) => {
  const data = await getSlotInfoAsync();
  res.status(200).json({ data });
};
