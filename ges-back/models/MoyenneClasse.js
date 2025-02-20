module.exports = (sequelize, DataTypes) => {
    const MoyenneClasse = sequelize.define("MoyenneClasse", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        classe: {
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
        moyenneClasse: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        moyennePremier: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        moyenneDernier: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        }
    });

    MoyenneClasse.associate = (models) => {
        MoyenneClasse.belongsTo(models.Classe, { foreignKey: 'classe', as: 'classeMoyenne' ,onUpdate: 'CASCADE',
            onDelete: 'CASCADE',});
        MoyenneClasse.belongsTo(models.Sequence, { foreignKey: 'sequence', as: 'sequenceMoyenneClasse' ,onUpdate: 'CASCADE',
            onDelete: 'CASCADE',});
        MoyenneClasse.belongsTo(models.Annee_Academique, { foreignKey: 'annee', as: 'anneeMoyenneClasse' ,onUpdate: 'CASCADE',
            onDelete: 'CASCADE',});
    };

    return MoyenneClasse;
};
