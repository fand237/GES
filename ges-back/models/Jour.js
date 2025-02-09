// models/Jour.js





module.exports = (sequelize,DataTypes) => {
  const Jour = sequelize.define("Jour",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jour: {
      type: DataTypes.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
      allowNull: false,
    },
  });

  Jour.checkOverlapJour = async function (jour) {
    try {
      const overlappingJour = await this.findAll({
        where: {
          jour: jour,
          
        },
        
      });

      return overlappingJour.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données Jour : ', error);
      throw error;
    }
  };

  return Jour;
};