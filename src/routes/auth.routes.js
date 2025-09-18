import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import expressAsyncHandler from "express-async-handler";
import { loginSchema, registerSchema } from "../validateSchemas/auth.schemas.js";
import { validate } from "../middlewares/validate.js";

const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), expressAsyncHandler(register));
authRoutes.post("/login", validate(loginSchema), expressAsyncHandler(login));

export default authRoutes;