// models/Type_Evaluation.js





module.exports = (sequelize,DataTypes) => {
    const Type_Evaluation = sequelize.define("Type_Evaluation",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM('Controle Continue', 'Evaluation Harmonisé'),
        allowNull: false,
      },
    });
  
    
  
    return Type_Evaluation;
  };