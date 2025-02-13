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

    Sequence.checkOverlapSequence = async function (sequence) {
        try {
            const overlappingSequence = await this.findAll({
                where: {
                    sequence: sequence,

                },

            });

            return overlappingSequence.length > 0;
        } catch (error) {
            console.error('Erreur lors de la vérification des chevauchements dans la base de données sequence : ', error);
            throw error;
        }
    };
  
    return Sequence;
  };