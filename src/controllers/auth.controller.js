import { loginAsync, registerAsync } from "../services/auth.service.js";

export const register = async (req, res, next) => {
    const { username, password, email, phone } = req.body;
    const data = await registerAsync({ username, email, password, phone });
    res.status(201).json({ data });
};

export const login = async (req, res, next) => {
    const { username, password } = req.body;
    const data = await loginAsync({ username, password });
    res.status(200).json({ data });
};