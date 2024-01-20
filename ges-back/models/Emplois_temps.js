
// models/Emplois.js


class Emplois  {

    constructor(id, classe) {
        this.id = id;
        this.classe = classe;
      }

}



module.exports = (sequelize,DataTypes) => {
  const Emplois = sequelize.define("Emplois",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    classe: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  });

  Emplois.findByClasse = async function (classeId) {
    let emploiDuTemps = await Emplois.findOne({
      where: {
        classe: classeId,
      },
    });

    if (!emploiDuTemps) {
      emploiDuTemps = await Emplois.create({
        classe: classeId,
      });
    }

    return emploiDuTemps;
  };

  return Emplois;
};
