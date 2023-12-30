// models/Cours.js


class Cours  {
  constructor(id, matiere, classe, heureDebut, heureFin) {
    this.id = id;
    this.matiere = matiere;
    this.classe = classe;
    this.heureDebut = heureDebut;
    this.heureFin = heureFin;
  }
}



module.exports = (sequelize,DataTypes) => {
  const Cours = sequelize.define("Cours",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    matiere: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    heureDebut: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    heureFin: {
      type: DataTypes.TIME,
      allowNull: false,
    },

  });
  return Cours;
};
