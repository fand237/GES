// migrations/XXXXXX-add-fields-to-enseignant.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Enseignants', 'numeroTelephone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Enseignants', 'indicatif', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Enseignants', 'typeEnseignant', {
      type: Sequelize.ENUM('Titulaire', 'Vacataire'),
      allowNull: false,
      defaultValue: 'Titulaire',
    });
    await queryInterface.addColumn('Enseignants', 'civilite', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Enseignants', 'numeroTelephone');
    await queryInterface.removeColumn('Enseignants', 'indicatif');
    await queryInterface.removeColumn('Enseignants', 'typeEnseignant');
    await queryInterface.removeColumn('Enseignants', 'civilite');
  }
};
