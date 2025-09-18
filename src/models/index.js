import { Sequelize } from "sequelize";
import database from "../config/database.js";
import user from "./user.js";
import parkingSlot from "./parkingSlot.js";
import parkingRecord from "./parkingRecord.js";

const env = process.env.NODE_ENV || "development";
const config = database[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = user(sequelize);
const ParkingSlot = parkingSlot(sequelize);
const ParkingRecord = parkingRecord(sequelize);

User.hasMany(ParkingRecord, { foreignKey: "userId" });
ParkingRecord.belongsTo(User, { foreignKey: "userId" });

ParkingSlot.hasMany(ParkingRecord, { foreignKey: "parkingSlotId" });
ParkingRecord.belongsTo(ParkingSlot, { foreignKey: "parkingSlotId" });

export { sequelize, Sequelize, User, ParkingSlot, ParkingRecord };
