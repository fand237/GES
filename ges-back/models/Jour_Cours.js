// models/Jour_cours.js


class JourCours  {

    constructor(cours, emploisTemps, jour) {
        this.cours = cours;
        this.emploisTemps = emploisTemps;
        this.jour = jour;
      }

}


module.exports = (sequelize,DataTypes) => {
  const JourCours = sequelize.define("JourCours",{
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cours',
        key: 'id',
      },
    },
    emploisTemps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Emplois',
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
  return JourCours;
};