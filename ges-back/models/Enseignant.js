// models/Enseignant.js


class Enseignant  {
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
  
 

  module.exports = (sequelize,DataTypes) => {
    const Enseignant = sequelize.define("Enseignant",{
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
        allowNull: true,
      },
      matiere: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emploisTemps: {
        type: DataTypes.INTEGER,
        
      },
  
    });
    return Enseignant;
  };  