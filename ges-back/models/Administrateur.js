const crypto = require('crypto');

// models/Administrateur.js
module.exports = (sequelize, DataTypes) => {
  const Administrateur = sequelize.define("Administrateur",{
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
    typeuser: {
      type: DataTypes.STRING,
      allowNull: true,
      
    },
  }, {
    hooks: {
      beforeCreate: (administrateur) => {
        administrateur.motDePasse = hashPassword(administrateur.motDePasse);
      },
      beforeUpdate: (administrateur) => {
        if (administrateur.changed('motDePasse')) {
          administrateur.motDePasse = hashPassword(administrateur.motDePasse);
        }
      },
    },
  });

  const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  };

  Administrateur.checkOverlapUsername = async function (nomUtilisateur) {
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

  Administrateur.checkOverlapEmail = async function (email) {
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

  return Administrateur;
};
