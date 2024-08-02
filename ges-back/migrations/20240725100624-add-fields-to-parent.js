'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Parents', 'civilite', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Monsieur', // Valeur par défaut, modifiez si nécessaire
    });
    await queryInterface.addColumn('Parents', 'situationMatriomiale', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Célibataire', // Valeur par défaut, modifiez si nécessaire
    });
    await queryInterface.addColumn('Parents', 'profession', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Parents', 'quartier', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Parents', 'typeuser', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Parent', // Valeur par défaut, modifiez si nécessaire
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Parents', 'civilite');
    await queryInterface.removeColumn('Parents', 'situationMatriomiale');
    await queryInterface.removeColumn('Parents', 'profession');
    await queryInterface.removeColumn('Parents', 'quartier');
    await queryInterface.removeColumn('Parents', 'typeuser');

  }
};
