// models/Enseignant.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Enseignant extends Model {
    constructor(id, nomUtilisateur, motDePasse, email, matiere, nom, prenom, emploisTemps) {
      this.id = id;
      this.nomUtilisateur = nomUtilisateur;
      this.motDePasse = motDePasse;
      this.email = email;
      this.matiere = matiere;
      this.nom = nom;
      this.prenom = prenom;
      this.emploisTemps = emploisTemps;
    }
  }
  
  Enseignant.init(
    {
      // Définissez les colonnes de votre modèle ici
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
      matiere: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emploisTemps: {
        type: DataTypes.INTEGER,
        references: {
          model: 'emplois', // Assurez-vous que c'est le nom correct de votre modèle d'emplois
          key: 'ID',
        },
      },
      // Ajoutez d'autres colonnes selon vos besoins
    },
    {
      sequelize,
      modelName: 'Enseignant',
    }
  );

  module.exports = Enseignant;
  