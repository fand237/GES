module.exports = (sequelize, DataTypes) => {
    const MoyenneGenerale = sequelize.define("MoyenneGenerale", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        eleve: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sequence: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        annee: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        moyenne: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        rang: {
            type: DataTypes.INTEGER,
            allowNull: true, // Sera calculé dynamiquement
        }
    });
    MoyenneGenerale.checkOverlapMoyenneGenerale = async function (eleve, sequence,annee) {
        try {
            const overlappingMoyenneGenerale = await this.findAll({
                where: {
                    eleve: eleve,
                    sequence:sequence,
                    annee:annee,

                },

            });

            return overlappingMoyenneGenerale.length > 0;
        } catch (error) {
            console.error('Erreur lors de la vérification des chevauchements dans la base de données Moyenne Generale : ', error);
            throw error;
        }
    };

    MoyenneGenerale.associate = (models) => {
        MoyenneGenerale.belongsTo(models.Eleve, {
            foreignKey: 'eleve',
            as: 'eleveMoyenneGenerale',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        MoyenneGenerale.belongsTo(models.Sequence, {
            foreignKey: 'sequence',
            as: 'sequenceMoyenneGenerale',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        MoyenneGenerale.belongsTo(models.Annee_Academique, {
            foreignKey: 'annee',
            as: 'anneeMoyenneGenerale',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });
    };



    return MoyenneGenerale;
};
