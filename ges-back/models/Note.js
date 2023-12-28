// models/Note.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Note extends Model {

    constructor(eleve, cours, note, dateEvaluation) {
        this.eleve = eleve;
        this.cours = cours;
        this.note = note;
        this.dateEvaluation = dateEvaluation;
      }

}

Note.init(
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
    note: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateEvaluation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Note',
  }
);

module.exports = Note;
