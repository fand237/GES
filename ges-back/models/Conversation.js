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
        },
        type: {
            type: DataTypes.ENUM('eleve_eleve', 'eleve-enseignant', 'annonce', 'groupe'),
            defaultValue: 'eleve_eleve',
            allowNull: false
        },
        createurId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        createurType: {
            type: DataTypes.ENUM('eleve', 'enseignant', 'system'),
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        estAnnonce: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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

        // Participants enseignants
        Conversation.belongsToMany(models.Enseignant, {
            through: 'ConversationEnseignants',
            as: 'participantsEnseignants',
            foreignKey: 'conversationId'
        });

        Conversation.belongsTo(models.Eleve, {
            foreignKey: 'createurId',
            constraints: false,
            as: 'createurEleve'
        });
    };

    return Conversation;
};