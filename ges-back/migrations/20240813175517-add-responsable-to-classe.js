'use strict';

// migrations/XXXXXX-add-responsable-to-classe.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Classes', 'responsable', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Enseignants',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Classes', 'responsable');
  }
};
