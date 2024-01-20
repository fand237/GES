// models/Jour_cours.js

const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Jour_Cours = sequelize.define("Jour_Cours", {
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emploisTemps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jour: {
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
  });

  Jour_Cours.associate = (models) => {
    Jour_Cours.belongsTo(models.Cours, {
      foreignKey: 'cours', // Assurez-vous que 'cours' est la clé étrangère correcte dans votre modèle JourCours
      as: 'coursDetails',
    });
  };

  Jour_Cours.checkOverlap = async function (jourId, heureDebut, heureFin, enseignantId) {
    try {
      const overlappingCours = await this.findAll({
        where: {
          jour: jourId,
          [Op.or]: [
            {
              heureDebut: {
                [Op.lt]: heureFin,
              },
              heureFin: {
                [Op.gt]: heureDebut,
              },
            },
            {
              heureDebut: {
                [Op.gte]: heureDebut,
              },
              heureFin: {
                [Op.lte]: heureFin,
              },
            },
          ],
        },
        include: [{
          model: sequelize.models.Cours,
          where: { Enseignant: enseignantId },
          as: 'coursDetails', // Assurez-vous que 'coursDetails' correspond à l'alias que vous avez défini dans votre modèle JourCours
        }],
      });

      return overlappingCours.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données (JourCours) : ', error);
      throw error;
    }
  };

  return Jour_Cours;
};
