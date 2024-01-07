// models/Administrateur.js





module.exports = (sequelize,DataTypes) => {
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

  });
  return Administrateur;
};