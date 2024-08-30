'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Presences', 'participation', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // Valeur par défaut
      validate: {
        min: 0,
        max: 5
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Presences', 'participation');
  }
};
