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
        }
    });

    Message.associate = (models) => {
        Message.belongsTo(models.Eleve, {
            foreignKey: 'envoyeurId',
            as: 'envoyeur'
        });

        Message.belongsTo(models.Conversation, {
            foreignKey: 'conversationId',
            as: 'conversation'
        });
    };

    return Message;
};