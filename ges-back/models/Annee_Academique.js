// models/Annee_Academique.js





module.exports = (sequelize,DataTypes) => {
    const Annee_Academique = sequelize.define("Annee_Academique",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      annee: {
        type: DataTypes.ENUM('2024-2025','2025-2026','2026-2027'),
        allowNull: false,
      },
    });

    Annee_Academique.checkOverlapAnnee_Academique = async function (annee) {
        try {
            const overlappingAnnee_Academique = await this.findAll({
                where: {
                    annee: annee,

                },

            });

            return overlappingAnnee_Academique.length > 0;
        } catch (error) {
            console.error('Erreur lors de la vérification des chevauchements dans la base de données groupe : ', error);
            throw error;
        }
    };
  
    return Annee_Academique;
  };