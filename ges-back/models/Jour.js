// models/Jour.js





module.exports = (sequelize,DataTypes) => {
  const Jour = sequelize.define("Jour",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jour: {
      type: DataTypes.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
      allowNull: false,
    },
  });

  

  return Jour;
};