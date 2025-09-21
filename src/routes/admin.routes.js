import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/auth.js";
import expressAsyncHandler from "express-async-handler";
import { checkIn, getParkingSlots } from "../controllers/admin.controller.js";

const parkingSlotsRoutes = Router();
parkingSlotsRoutes.get("/", expressAsyncHandler(getParkingSlots));
parkingSlotsRoutes.post("/checkIn/:slotId", expressAsyncHandler(checkIn));

const adminRoutes = Router();
adminRoutes.use(requireAuth);
adminRoutes.use(requireAdmin);
adminRoutes.use("/parkingSlots", parkingSlotsRoutes);

export default adminRoutes;