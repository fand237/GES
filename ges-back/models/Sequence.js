// models/Sequence.js





module.exports = (sequelize,DataTypes) => {
    const Sequence = sequelize.define("Sequence",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sequence: {
        type: DataTypes.ENUM('1ere Sequence', '2eme Sequence', '3eme Sequence', '4eme Sequence', '5eme Sequence', '6eme Sequence'),
        allowNull: false,
      },
    });
  
    
  
    return Sequence;
  };