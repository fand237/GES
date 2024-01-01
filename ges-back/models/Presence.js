// models/Presence.js


class Presence  {

    constructor(eleve, cours, jour) {
        this.eleve = eleve;
        this.cours = cours;
        this.jour = jour;
      }

}



module.exports = (sequelize,DataTypes) => {
  const Presence = sequelize.define("Presence",{
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    jour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },

  });
  return Presence;
};