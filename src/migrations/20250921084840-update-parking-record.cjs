'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ParkingRecords', 'licensePlate', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ParkingRecords', 'licensePlate', {
      type: Sequelize.STRING(20),
      allowNull: false,
    });
  }
};
