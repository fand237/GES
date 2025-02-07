// models/Matiere.js

module.exports = (sequelize, DataTypes) => {
    const Matiere = sequelize.define("Matiere", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Assure que le nom de la matière est unique
      },
      
    });
  
  
    // Méthode pour vérifier si une matière existe déjà
    Matiere.checkOverlapMatiere = async function (nom) {
      try {
        const existingMatiere = await this.findOne({
          where: {
            nom: nom,
          },
        });
        return existingMatiere !== null;
      } catch (error) {
        console.error('Erreur lors de la vérification des doublons de matière : ', error);
        throw error;
      }
    };
  
    return Matiere;
  };