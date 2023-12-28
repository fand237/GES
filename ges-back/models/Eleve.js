// models/Eleve.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class Eleve extends Model {
    constructor(id, nomUtilisateur, motDePasse, email, matiere, nom, prenom, dateNaissance, note, classe, parent) {
        this.id = id;
        this.nomUtilisateur = nomUtilisateur;
        this.motDePasse = motDePasse;
        this.email = email;
        this.matiere = matiere;
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.note = note;
        this.classe = classe;
        this.parent = parent;
    }
}

Eleve.init(
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
      dateNaissance: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      note: {
        type: DataTypes.INTEGER,
      },
      classe: {
        type: DataTypes.STRING,
      },
      parent: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Parent', // Assurez-vous que c'est le nom correct de votre modèle Parent
          key: 'ID',
        },
      },
    },
    {
      sequelize,
      modelName: 'Eleve',
    }
  );
  
  module.exports = Eleve;
