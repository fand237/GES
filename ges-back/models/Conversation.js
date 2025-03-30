// models/Conversation.js
module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define("Conversation", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        titre: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        classeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Conversation.associate = (models) => {
        Conversation.belongsTo(models.Classe, {
            foreignKey: 'classeId',
            as: 'classe'
        });

        Conversation.belongsToMany(models.Eleve, {
            through: 'ConversationEleves',
            as: 'participants',
            foreignKey: 'conversationId'
        });

        Conversation.hasMany(models.Message, {
            foreignKey: 'conversationId',
            as: 'messages'
        });
    };

    return Conversation;
};