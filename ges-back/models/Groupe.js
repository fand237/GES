// models/Groupe.js





module.exports = (sequelize,DataTypes) => {
    const Groupe = sequelize.define("Groupe",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      groupe: {
        type: DataTypes.ENUM('1er Groupe', '2eme Groupe', '3eme Groupe'),
        allowNull: false,
      },
    });
  
    
  
    return Groupe;
  };