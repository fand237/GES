// migrations/YYYYMMDDHHMMSS-add-ville-and-numeroIncremental-to-eleves.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Classes', 'capacite', {
      type: Sequelize.INTEGER,
      allowNull: false,

    });

    await queryInterface.addColumn('Classes', 'cycle', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Cycles', // nom de la table cible
        key: 'id', // clé cible dans la table cible
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Classes', 'capacite');
    await queryInterface.removeColumn('Classes', 'cycle');
  }
};
