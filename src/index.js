import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import { sequelize } from "./models/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(json());

app.use(errorHandler);


const PORT = process.env.PORT || 8080;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        app.listen(PORT, () => {
            console.log(`🚀 Express running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start:', err);
    }
})();