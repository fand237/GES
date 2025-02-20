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
