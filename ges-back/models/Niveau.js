// models/Niveau.js
module.exports = (sequelize, DataTypes) => {
    const Niveau = sequelize.define("Niveau", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Niveau.associate = (models) => {
        Niveau.hasMany(models.Classe, {
            foreignKey: 'niveauId',
            as: 'classes'
        });
    };

    return Niveau;
};