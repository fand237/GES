'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     // Supprimer la colonne 'Enseignant' si elle existe
     const tableDescription = await queryInterface.describeTable('Cours');
    
     if (tableDescription.Enseignant) {
       await queryInterface.removeColumn('Cours', 'Enseignant');
     }
 
     // Ajouter la colonne 'Enseignant' avec les nouvelles contraintes
     await queryInterface.addColumn('Cours', 'Enseignant', {
       type: Sequelize.INTEGER,
       references: {
         model: 'Enseignants', // nom de la table des enseignants
         key: 'id',
       },
       onUpdate: 'CASCADE',
       onDelete: 'CASCADE',
     });
  },

  async down (queryInterface, Sequelize) {
      // Suppression de la clé étrangère 'Enseignant' de la table 'Cours'
      await queryInterface.removeColumn('Cours', 'Enseignant');
    }
  
};
