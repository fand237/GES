// models/Cours.js
const { Op } = require('sequelize');





module.exports = (sequelize, DataTypes) => {
  const Cours = sequelize.define("Cours", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matiere: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    heureDebut: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    heureFin: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    jour: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    Enseignant: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    emploisTemps: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    coefficient: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },
    groupe: {
      type: DataTypes.INTEGER,
      allowNull: true,

    },

  });

  Cours.associate = (models) => {
    Cours.hasMany(models.Jour_Cours, {
      foreignKey: 'cours',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Cette ligne active la suppression en cascade
    });

    Cours.belongsTo(models.Classe, {
      foreignKey: 'classe',
      as: 'classeCours',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève

    });

    Cours.belongsTo(models.Jour, {
      foreignKey: 'jour',
      as: 'jourCours',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève

    });

    Cours.belongsTo(models.Groupe, {
      foreignKey: 'groupe',
      as: 'groupeCours',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève

    });


    Cours.belongsTo(models.Enseignant, {
      foreignKey: 'Enseignant',
      as: 'enseignant',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  

  Cours.checkOverlap = async function (matiere, classeId) {
    try {
      const overlappingCours = await this.findAll({
        where: {
          matiere: matiere,
          classe: classeId,

        },

      });

      return overlappingCours.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données (JourCours) : ', error);
      throw error;
    }
  };

  return Cours;
};
