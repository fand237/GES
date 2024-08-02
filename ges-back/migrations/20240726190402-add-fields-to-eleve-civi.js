// migrations/XXXXXX-add-fields-to-enseignant.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn('Eleves', 'civilite', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.removeColumn('Eleves', 'civilite');
  }
};
