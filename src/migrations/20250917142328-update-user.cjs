'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: false,
      validate: {
        is: /^[0-9+\-() ]*$/i,
      },
    });
    await queryInterface.removeColumn('Users', 'password', {});
    await queryInterface.addColumn('Users', 'passwordHash', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      validate: {
        is: /^[0-9+\-() ]*$/i,
      },
    });
    await queryInterface.removeColumn('Users', 'passwordHash', {});
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('Users', 'name', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  }
};
