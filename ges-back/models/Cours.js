// models/Cours.js





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
      allowNull: true,
    },
    heureFin: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    jour: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    Enseignant: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },

  });

  
  return Cours;
};
