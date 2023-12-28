// models/Presence.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Presence extends Model {

    constructor(eleve, cours, jour) {
        this.eleve = eleve;
        this.cours = cours;
        this.jour = jour;
      }

}

Presence.init(
  {
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Eleve',
        key: 'id',
      },
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cours',
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
    modelName: 'Presence',
  }
);

module.exports = Presence;
