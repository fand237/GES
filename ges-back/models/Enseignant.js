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
      numeroTelephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      indicatif: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "+237", // Définir la valeur par défaut ici

      },
      typeEnseignant: {
        type: DataTypes.ENUM('Titulaire', 'Vacataire'),
        allowNull: false,
      },
      civilite: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      numeroIncremental: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      typeuser: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Enseignant", // Définir la valeur par défaut ici

      },
  
  
    });

    Enseignant.associate = (models) => {
      // autres associations...
    
      Enseignant.hasMany(models.Cours, {
        foreignKey: 'Enseignant',
        as: 'cours',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });

      Enseignant.hasMany(models.Classe, { // Relation inverse avec Classe
        foreignKey: 'responsable',
        as: 'ResponsableClasse',
      });
    };

    Enseignant.checkOverlapUsername = async function (nomUtilisateur) {
      try {
        const overlappingParent = await this.findAll({
          where: {
            nomUtilisateur: nomUtilisateur,
            
          },
          
        });
  
        return overlappingParent.length > 0;
      } catch (error) {
        console.error('Erreur lors de la vérification des chevauchements dans la base de données nom utilisateur : ', error);
        throw error;
      }
    };
  
    Enseignant.checkOverlapEmail = async function (email) {
      try {
        const overlappingParent = await this.findAll({
          where: {
            email: email,
            
          },
          
        });  
  
        return overlappingParent.length > 0;
      } catch (error) {
        console.error('Erreur lors de la vérification des chevauchements dans la base de données Email : ', error);
        throw error;
      }
    };

    Enseignant.checkOverlapnumero = async function (indicatif,numero) {
      try {
        const overlappingParent = await this.findAll({
          where: {
            indicatif: indicatif,
            numeroTelephone: numero,
            
          },
          
        });
  
        return overlappingParent.length > 0;
      } catch (error) {
        console.error('Erreur lors de la vérification des chevauchements dans la base de données numero : ', error);
        throw error;
      }
    };

    return Enseignant;
  };  