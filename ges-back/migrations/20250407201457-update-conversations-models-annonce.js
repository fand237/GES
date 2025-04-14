// Dans le fichier de migration généré
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Conversations', 'estAnnonce', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Conversations', 'estAnnonce');
  }

};