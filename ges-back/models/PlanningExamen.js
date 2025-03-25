// models/PlanningExamen.js

module.exports = (sequelize, DataTypes) => {
    const PlanningExamen = sequelize.define("PlanningExamen", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        heureDebut: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        heureFin: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        duree: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        matiere: {
            type: DataTypes.INTEGER, // Clé étrangère vers le modèle Cours
            allowNull: false,
            references: {
                model: 'Cours', // Nom de la table Cours
                key: 'id',
            },
        },
        niveauId: {  // Remplace le champ classe par niveauId
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Niveaus',
                key: 'id',
            },
        },
        SequenceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Sequences', // Nom de la table Sequence
                key: 'id',
            },
        },
        AnneeAcademiqueId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Annee_Academiques', // Nom de la table Annee_Academique
                key: 'id',
            },
        },
    });

    // Relations
    PlanningExamen.associate = (models) => {
        PlanningExamen.belongsTo(models.Sequence, { foreignKey: 'SequenceId' });
        PlanningExamen.belongsTo(models.Annee_Academique, { foreignKey: 'AnneeAcademiqueId' });
        PlanningExamen.belongsTo(models.Cours, { foreignKey: 'matiere', as: 'Matiere' }); // Relation avec Cours
        PlanningExamen.belongsTo(models.Niveau, { foreignKey: 'niveauId', as: 'Niveau' }); // Relation avec Classe

    };

    return PlanningExamen;
};