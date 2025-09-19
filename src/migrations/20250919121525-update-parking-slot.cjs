'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ParkingSlots', 'status', {
      type: Sequelize.ENUM('available', 'booked', 'occupied'),
      allowNull: false,
      defaultValue: 'available'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ParkingSlots', 'status', {});
  }
};
