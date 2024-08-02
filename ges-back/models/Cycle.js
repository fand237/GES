// models/Cycle.js





module.exports = (sequelize,DataTypes) => {
    const Cycle = sequelize.define("Cycle",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cycle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      
    });
  
    Cycle.associate = (models) => {
        Cycle.hasMany(models.Classe, {
        foreignKey: 'cycle',
        as: 'CycleClasse',
      });
    };
  

    return Cycle;
  }; 