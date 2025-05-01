// models/Message.js
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        contenu: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        envoyeurId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lu: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        envoyeurType: {
            type: DataTypes.ENUM('eleve', 'enseignant'),
            allowNull: false
        },
        estAnnonce: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        pinned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        fichierJoint: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    Message.associate = (models) => {
        Message.belongsTo(models.Eleve, {
            foreignKey: 'envoyeurId',
            as: 'envoyeur',
            constraints: false
        });

        Message.belongsTo(models.Conversation, {
            foreignKey: 'conversationId',
            as: 'conversation'
        });

        Message.belongsTo(models.Enseignant, {
            foreignKey: 'envoyeurId',
            constraints: false,
            as: 'envoyeurEnseignant'
        });
    };



    return Message;
};