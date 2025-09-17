import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class ParkingSlot extends Model { }

    ParkingSlot.init(
        {
            licensePlate: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ParkingSlot",
        }
    );

    return ParkingSlot;
};
