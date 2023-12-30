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
      references: {
        model: 'Eleve',
        key: 'id',
      },
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cours',
        key: 'id',
      },
    },
    jour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Jour',
        key: 'id',
      },
    },

  });
  return Presence;
};