'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Enseignants', 'typeuser', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'Enseignant',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Enseignants', 'typeuser', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },
};
