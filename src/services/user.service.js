import { ParkingRecord, User, ParkingSlot } from "../models/index.js";
import { AppError } from "../errors/appError.js";
import { Op } from "sequelize";

export const getUserProfileAsync = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["passwordHash"] },
  });
  if (!user) {
    throw new AppError("USER_NOT_FOUND", 404);
  }
  return user;
};

export const bookingAsync = async ({ bookingTime, parkingSlotId, userId }) => {
  const existingBooking = await ParkingRecord.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            { userId: userId },
            { status: { [Op.in]: ["booked", "checked-in"] } },
          ],
        },
        {
          [Op.and]: [
            { parkingSlotId: parkingSlotId },
            { status: { [Op.in]: ["booked", "checked-in"] } },
          ],
        },
      ],
    },
  });
  if (existingBooking) {
    throw new AppError("ALREADY_BOOKED", 400);
  }
  const newBooking = await ParkingRecord.create({
    bookingTime,
    parkingSlotId,
    userId,
    status: "booked",
  });
  const slot = await ParkingSlot.findByPk(parkingSlotId);
  slot.status = "booked";
  await slot.save();
  return newBooking;
};

export const getBookingsAsync = async (userId) => {
  const bookings = await ParkingRecord.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return bookings;
};

export const cancelBookingAsync = async (userId) => {
  const booking = await ParkingRecord.findOne({
    where: {
      userId,
      status: "booked",
    },
  });
  if (!booking) {
    throw new AppError("NO_ACTIVE_BOOKING", 404);
  }
  booking.status = "cancelled";
  const slot = await ParkingSlot.findByPk(booking.parkingSlotId);
  slot.status = "available";
  await slot.save();
  await booking.save();
  return booking;
};

export const getSlotInfoAsync = async () => {
  const slots = await ParkingSlot.findAll({
    attributes: ["id", "status"], // chỉ lấy id và status
  });
  return slots;
};
