// models/Parent.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Parent extends Model {
    constructor(id, nomUtilisateur, motDePasse, email, nom, prenom) {
        this.id = id;
        this.nomUtilisateur = nomUtilisateur;
        this.motDePasse = motDePasse;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
    }
}

Parent.init(
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
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Parent',
    }
);

module.exports = Parent;
