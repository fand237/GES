// models/Jour.js


class Jour  {

    constructor(id, jour) {
        this.id = id;
        this.jour = jour;
      }

}


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