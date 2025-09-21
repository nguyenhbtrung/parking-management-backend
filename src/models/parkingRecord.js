import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class ParkingRecord extends Model { }

    ParkingRecord.init(
        {
            licensePlate: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('booked', 'checked-in', 'check-out', 'cancelled'),
                allowNull: false,
            },
            bookingTime: {
                type: DataTypes.DATE,
            },
            checkInTime: {
                type: DataTypes.DATE,
            },
            checkOutTime: {
                type: DataTypes.DATE,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            parkingSlotId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'ParkingSlots',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
        },
        {
            sequelize,
            modelName: "ParkingRecord",
        }
    );

    return ParkingRecord;
};
