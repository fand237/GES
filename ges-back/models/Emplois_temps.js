
// models/Emplois.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Emplois extends Model {

    constructor(id, classe) {
        this.id = id;
        this.classe = classe;
      }

}

Emplois.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    classe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Emplois',
  }
);

module.exports = Emplois;
