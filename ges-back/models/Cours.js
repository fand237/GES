// models/Cours.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Cours extends Model {
  constructor(id, matiere, classe, heureDebut, heureFin) {
    this.id = id;
    this.matiere = matiere;
    this.classe = classe;
    this.heureDebut = heureDebut;
    this.heureFin = heureFin;
  }
}

Cours.init(
  {
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    heureDebut: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    heureFin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Cours',
  }
);

module.exports = Cours;
