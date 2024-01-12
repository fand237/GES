// models/Classe.js





module.exports = (sequelize,DataTypes) => {
    const Classe = sequelize.define("Classe",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      classe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    

    return Classe;
  };