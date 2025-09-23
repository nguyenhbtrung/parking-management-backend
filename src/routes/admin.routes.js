import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import expressAsyncHandler from "express-async-handler";
import { cancelBookingSlot, checkIn, checkOut, createUser, deleteUser, getParkingRecords, getParkingSlots, getUsers, updateUser } from "../controllers/admin.controller.js";

const parkingSlotsRoutes = Router();
parkingSlotsRoutes.get("/", expressAsyncHandler(getParkingSlots));
parkingSlotsRoutes.post("/checkIn/:slotId", expressAsyncHandler(checkIn));
parkingSlotsRoutes.post("/checkOut/:slotId", expressAsyncHandler(checkOut));
parkingSlotsRoutes.post("/cancel/:slotId", expressAsyncHandler(cancelBookingSlot));

const parkingRecordsRoutes = Router();
parkingRecordsRoutes.get("/", expressAsyncHandler(getParkingRecords));

const usersRoutes = Router();
usersRoutes.get("/", expressAsyncHandler(getUsers));
usersRoutes.post("/", expressAsyncHandler(createUser));
usersRoutes.put("/:id", expressAsyncHandler(updateUser));
usersRoutes.delete("/:id", expressAsyncHandler(deleteUser));

const adminRoutes = Router();
adminRoutes.use(requireAuth);
adminRoutes.use(requireAdmin);
adminRoutes.use("/parkingSlots", parkingSlotsRoutes);
adminRoutes.use("/parkingRecords", parkingRecordsRoutes);
adminRoutes.use("/users", usersRoutes);

export default adminRoutes;