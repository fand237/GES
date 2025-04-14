// models/ConversationEnseignant.js
module.exports = (sequelize, DataTypes) => {
    const ConversationEnseignant = sequelize.define("ConversationEnseignant", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Conversations',
                key: 'id'
            }
        },
        enseignantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Enseignants',
                key: 'id'
            }
        },
        joinedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });

    return ConversationEnseignant;
};