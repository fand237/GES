// models/Jour.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Jour extends Model {

    constructor(id, jour) {
        this.id = id;
        this.jour = jour;
      }

}

Jour.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jour: {
      type: DataTypes.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Jour',
  }
);

module.exports = Jour;
