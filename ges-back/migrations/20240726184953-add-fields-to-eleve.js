// migrations/YYYYMMDDHHMMSS-add-ville-and-numeroIncremental-to-eleves.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Eleves', 'ville', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "yaounde",

    });

    await queryInterface.addColumn('Eleves', 'numeroIncremental', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Eleves', 'ville');
    await queryInterface.removeColumn('Eleves', 'numeroIncremental');
  }
};
