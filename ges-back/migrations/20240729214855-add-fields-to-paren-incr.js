// migrations/YYYYMMDDHHMMSS-add-ville-and-numeroIncremental-to-eleves.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
   

    await queryInterface.addColumn('Parents', 'numeroIncremental', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Parents', 'numeroIncremental');
  }
};
