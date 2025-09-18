import { ParkingRecord, User } from "../models/index.js";
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

export const bookingAsync = async ({
  licensePlate,
  bookingTime,
  parkingSlotId,
  userId,
}) => {
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
    licensePlate,
    bookingTime,
    parkingSlotId,
    userId,
    status: "booked",
  });
  return newBooking;
};

export const getBookingsAsync = async (userId) => {
  const bookings = await ParkingRecord.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  return bookings;
};
