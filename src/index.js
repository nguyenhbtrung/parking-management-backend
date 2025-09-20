import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import { sequelize } from "./models/index.js";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(cors());
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    app.listen(PORT, () => {
      console.log(`🚀 Express running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start:", err);
  }
})();
