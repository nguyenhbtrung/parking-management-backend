'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('ParkingRecords', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      licensePlate: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('booked', 'checked-in', 'check-out'),
        allowNull: false,
      },
      bookingTime: {
        type: Sequelize.DATE,
      },
      checkInTime: {
        type: Sequelize.DATE,
      },
      checkOutTime: {
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      parkingSlotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ParkingSlots',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('ParkingRecords');
  }
};
