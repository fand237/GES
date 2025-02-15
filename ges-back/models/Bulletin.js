// models/Bulletin.js





module.exports = (sequelize, DataTypes) => {
    const Bulletin = sequelize.define("Bulletin", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        eleve: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        note: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cours: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        annee: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    });

    Bulletin.associate = (models) => {
        Bulletin.belongsTo(models.Eleve, {
            foreignKey: 'eleve',
            as: 'eleveBulletin',
            onUpdate: 'CASCADE', // Active la mise à jour en cascade
            onDelete: 'CASCADE', // Cette ligne active la suppression en cascade
        });

        Bulletin.belongsTo(models.Cours, {
            foreignKey: 'cours',
            as: 'coursBulletin',
            onUpdate: 'CASCADE', // Active la mise à jour en cascade
            onDelete: 'CASCADE', // Cette ligne active la suppression en cascade
        });

        Bulletin.belongsTo(models.Note, {
            foreignKey: 'note',
            as: 'noteBulletin',
            onUpdate: 'CASCADE', // Active la mise à jour en cascade
            onDelete: 'CASCADE', // Cette ligne active la suppression en cascade
        });

        Bulletin.belongsTo(models.Annee_Academique, {
            foreignKey: 'annee',
            as: 'anneeBulletin',
            onUpdate: 'CASCADE', // Active la mise à jour en cascade
            onDelete: 'CASCADE', // Cette ligne active la suppression en cascade
        });


        Bulletin.belongsTo(models.Moyenne, {
            foreignKey: 'eleve',
            targetKey: 'eleve',
            as: 'moyenneEleve',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        Bulletin.belongsTo(models.Moyenne, {
            foreignKey: 'cours',
            targetKey: 'cours',
            as: 'moyenneCours',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });




    };



    return Bulletin;
};