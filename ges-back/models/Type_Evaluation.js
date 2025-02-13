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

    Type_Evaluation.checkOverlapType_Evaluation = async function (type) {
        try {
            const overlappingType_Evaluation = await this.findAll({
                where: {
                    type: type,

                },

            });

            return overlappingType_Evaluation.length > 0;
        } catch (error) {
            console.error('Erreur lors de la vérification des chevauchements dans la base de données Type_Evaluation : ', error);
            throw error;
        }
    };
  
    return Type_Evaluation;
  };