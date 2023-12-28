// models/Administrateur.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Administrateur extends Model {
    constructor(id, nomUtilisateur, motDePasse, email) {
        this.id = id;
        this.nomUtilisateur = nomUtilisateur;
        this.motDePasse = motDePasse;
        this.email = email;
    }
}

Administrateur.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomUtilisateur: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Administrateur',
    }
);

module.exports = Administrateur;
