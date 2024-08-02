'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.addColumn('Parents', 'typeuser', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Parent', // Valeur par défaut, modifiez si nécessaire
    });

  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeColumn('Parents', 'typeuser');

  }
};
