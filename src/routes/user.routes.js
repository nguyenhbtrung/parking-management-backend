import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { requireAuth } from "../middlewares/auth.js";
import {
  booking,
  getUserProfile,
  getBookings,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(requireAuth);

userRouter.post("/booking", expressAsyncHandler(booking));
userRouter.get("/profile", expressAsyncHandler(getUserProfile));
userRouter.get("/allBookings", expressAsyncHandler(getBookings));

export default userRouter;
