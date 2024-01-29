// models/Annee_Academique.js





module.exports = (sequelize,DataTypes) => {
    const Annee_Academique = sequelize.define("Annee_Academique",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      annee: {
        type: DataTypes.ENUM('2022-2023','2023-2024','2024-2025','2025-2026'),
        allowNull: false,
      },
    });
  
    
  
    return Annee_Academique;
  };