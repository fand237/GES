'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/xxxxxx-add-associations-to-eleve.js

// migrations/xxxxxx-add-associations-to-eleve.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Eleves');
    
    if (!tableInfo.classe) {
      await queryInterface.addColumn('Eleves', 'classe', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Classes', // nom de la table cible
          key: 'id', // clé cible dans la table cible
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    if (!tableInfo.parent) {
      await queryInterface.addColumn('Eleves', 'parent', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Parents', // nom de la table cible
          key: 'id', // clé cible dans la table cible
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Eleves');
    
    if (tableInfo.classe) {
      await queryInterface.removeColumn('Eleves', 'classe');
    }

    if (tableInfo.parent) {
      await queryInterface.removeColumn('Eleves', 'parent');
    }
  },
};
