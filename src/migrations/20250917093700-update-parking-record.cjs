'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TYPE "enum_ParkingRecords_status"
    ADD VALUE IF NOT EXISTS 'cancelled';
  `);
  },

  async down(queryInterface, Sequelize) {
    console.warn('Down migration for ENUM not supported.');
  }
};
