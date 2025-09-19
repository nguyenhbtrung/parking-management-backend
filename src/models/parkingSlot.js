import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class ParkingSlot extends Model { }

    ParkingSlot.init(
        {
            licensePlate: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('available', 'booked', 'occupied'),
                allowNull: false,
                defaultValue: 'available'
            },
        },
        {
            sequelize,
            modelName: "ParkingSlot",
        }
    );

    return ParkingSlot;
};
