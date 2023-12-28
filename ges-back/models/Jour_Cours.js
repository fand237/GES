// models/Jour_cours.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class JourCours extends Model {

    constructor(cours, emploisTemps, jour) {
        this.cours = cours;
        this.emploisTemps = emploisTemps;
        this.jour = jour;
      }

}

JourCours.init(
  {
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cours',
        key: 'id',
      },
    },
    emploisTemps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Emplois',
        key: 'id',
      },
    },
    jour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jour',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'JourCours',
  }
);

module.exports = JourCours;
