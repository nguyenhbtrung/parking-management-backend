import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
    class User extends Model { }

    User.init(
        {
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
                unique: false,
                validate: {
                    is: /^[0-9+\-() ]*$/i,
                },
            },
            role: {
                type: DataTypes.ENUM('admin', 'user'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "User",
        }
    );

    return User;
};
