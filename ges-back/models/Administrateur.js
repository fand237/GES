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

  return Administrateur;
};
