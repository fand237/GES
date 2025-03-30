const { Sequelize } = require('sequelize');
const {Conversation, Eleve} = require("../models");

module.exports = (io) => {
    const router = require('express').Router();
    const { Conversation, Message, Eleve,ConversationEleve } = require("../models");
    const { validateToken } = require("../middlewares/AuthMiddleware");

    const notifyParticipants = async (conversationId, event, data) => {
        const conversation = await Conversation.findByPk(conversationId, {
            include: [{
                model: Eleve,
                as: 'participants',
                attributes: ['id'],
                through: { attributes: [] }
            }]
        });

        conversation.participants.forEach(participant => {
            io.to(`user_${participant.id}`).emit(event, data);
        });
    };

    // Créer ou récupérer une conversation
    router.post('/', validateToken, async (req, res) => {
        try {
            const { eleveId, participantId } = req.body;
            console.log("Requête reçue avec IDs:", eleveId, participantId);

            // 1. Vérifier que les IDs sont valides
            if (!eleveId || !participantId) {
                return res.status(400).json({ error: "IDs des élèves manquants" });
            }

            // 2. Trouver les élèves avec vérification d'existence
            const [eleve1, eleve2] = await Promise.all([
                Eleve.findByPk(eleveId),
                Eleve.findByPk(participantId)
            ]);

            console.log("Élèves trouvés:", eleve1?.id, eleve2?.id);

            if (!eleve1 || !eleve2) {
                return res.status(404).json({
                    error: "Un ou plusieurs élèves non trouvés",
                    details: {
                        eleve1Exists: !!eleve1,
                        eleve2Exists: !!eleve2
                    }
                });
            }

            // 3. Vérifier les conversations existantes (version corrigée)
            const existingConversation = await Conversation.findOne({
                include: [
                    {
                        model: Eleve,
                        as: 'participants',
                        where: {
                            id: { [Sequelize.Op.in]: [eleveId, participantId] }
                        },
                        attributes: [],
                        through: { attributes: [] }
                    }
                ],
                group: ['Conversation.id'],
                having: Sequelize.literal(`COUNT(DISTINCT participants.id) = 2`),
                subQuery: false
            });

            if (existingConversation) {
                return res.json(existingConversation);
            }

            // 4. Créer nouvelle conversation
            if (eleve1.classe !== eleve2.classe) {
                return res.status(400).json({ error: "Élèves de classes différentes" });
            }

            const conversation = await Conversation.create({
                classeId: eleve1.classe,
                titre: `${eleve1.prenom} et ${eleve2.prenom}`
            });

            await conversation.addParticipants([eleveId, participantId]);

            res.status(201).json(conversation);
        } catch (error) {
            console.error("Erreur complète:", error);
            res.status(500).json({
                error: 'Erreur serveur',
                details: error.message
            });
        }
    });

    // Lister les conversations
    router.get('/:eleveId', validateToken, async (req, res) => {
        try {
            // 1. D'abord trouver toutes les conversations de l'élève
            const conversations = await Conversation.findAll({
                include: [{
                    model: Eleve,
                    as: 'participants',
                    through: {
                        where: { eleveId: req.params.eleveId },
                        attributes: []
                    },
                    required: true,
                    attributes: []
                }],
                raw: true
            });

            // 2. Ensuite charger les détails complets pour ces conversations
            const fullConversations = await Conversation.findAll({
                where: { id: conversations.map(c => c.id) },
                include: [
                    {
                        model: Eleve,
                        as: 'participants',
                        attributes: ['id', 'nom', 'prenom'],
                        through: { attributes: [] } // Ne pas inclure les champs de la table de jointure
                    },
                    {
                        model: Message,
                        as: 'messages',
                        attributes: ['id', 'contenu', 'createdAt'],
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                        include: [{
                            model: Eleve,
                            as: 'envoyeur',
                            attributes: ['id', 'nom', 'prenom']
                        }]
                    }
                ]
            });

            // Tri des conversations
            fullConversations.sort((a, b) => {
                const dateA = a.messages[0]?.createdAt || 0;
                const dateB = b.messages[0]?.createdAt || 0;
                return new Date(dateB) - new Date(dateA);
            });

            res.json(fullConversations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
    // Obtenir les messages
    router.get('/:conversationId/messages', validateToken, async (req, res) => {
        try {
            const messages = await Message.findAll({
                where: { conversationId: req.params.conversationId },
                include: [{
                    model: Eleve,
                    as: 'envoyeur',
                    attributes: ['id', 'nom', 'prenom']
                }],
                order: [['createdAt', 'ASC']]
            });

            // Marquer comme lus
            await Message.update(
                { lu: true },
                {
                    where: {
                        conversationId: req.params.conversationId,
                        envoyeurId: { [Sequelize.Op.ne]: req.utilisateur.id },
                        lu: false
                    }
                }
            );

            res.json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    // POST pour créer un nouveau message
    router.post('/:conversationId/messages', validateToken, async (req, res) => {
        try {
            const { contenu, envoyeurId } = req.body;
            const { conversationId } = req.params;

            // Validation basique
            if (!contenu || !envoyeurId) {
                return res.status(400).json({ error: "Contenu et envoyeurId sont requis" });
            }

            // Vérifier que l'envoyeur fait partie de la conversation
            const isParticipant = await Conversation.findOne({
                where: { id: conversationId },
                include: [{
                    model: Eleve,
                    as: 'participants',
                    where: { id: envoyeurId },
                    required: true
                }]
            });

            if (isParticipant.length === 0) {
                return res.status(403).json({ error: "Vous ne faites pas partie de cette conversation" });
            }

            const conversation = await Conversation.findByPk(conversationId);
            if (!conversation) {
                return res.status(404).json({ error: "Conversation non trouvée" });
            }

            const envoyeur = await Eleve.findByPk(envoyeurId);
            if (!envoyeur) {
                return res.status(404).json({ error: "Envoyeur non trouvé" });
            }

            // Créer le message
            const message = await Message.create({
                contenu,
                envoyeurId,
                conversationId,
                lu: false
            });


            // Populer les données de l'envoyeur pour la réponse
            const messageWithSender = await Message.findByPk(message.id, {
                include: [{
                    model: Eleve,
                    as: 'envoyeur',
                    attributes: ['id', 'nom', 'prenom']
                }]
            });

            // Émettre l'événement socket.io
            io.to(`conv_${conversationId}`).emit('newMessage', messageWithSender);

            // Notifier tous les participants
            const conversations = await Conversation.findByPk(conversationId, {
                include: [{
                    model: Eleve,
                    as: 'participants',
                    attributes: ['id'],
                    through: { attributes: [] }
                }]
            });

            conversations.participants.forEach(participant => {
                if (participant.id !== envoyeurId) {
                    io.to(`user_${participant.id}`).emit('messageNotification', {
                        conversationId,
                        message: messageWithSender
                    });
                }
            });




            res.status(201).json(messageWithSender);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    return router;
};