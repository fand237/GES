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
    
    Groupe.checkOverlapGroupe = async function (groupe) {
      try {
        const overlappingGroupe = await this.findAll({
          where: {
            groupe: groupe,
            
          },
          
        });
  
        return overlappingGroupe.length > 0;
      } catch (error) {
        console.error('Erreur lors de la vérification des chevauchements dans la base de données groupe : ', error);
        throw error;
      }
    };
  
    return Groupe;
  };