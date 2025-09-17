'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: false,
      validate: {
        is: /^[0-9+\-() ]*$/i,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        is: /^[0-9+\-() ]*$/i,
      },
    });
  }
};
