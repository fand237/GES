const { Sequelize } = require('sequelize');
const {sendNotification} = require("../middlewares/socketMiddleware");
const { Conversation, Eleve, Enseignant,Classe,Cours,Message} = require("../models");
const {validateToken} = require("../middlewares/AuthMiddleware");
const upload = require("../config/multerConfig");
const path = require('path');
const fs = require('fs');

module.exports = (io, sendNotification) => {
    const router = require('express').Router();
    const { Conversation, Eleve, Enseignant,Classe,Cours,Message} = require("../models");
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
            const { eleveId1, eleveId2 } = req.body;

            // Vérifier que les élèves existent et sont dans la même classe
            const [eleve1, eleve2] = await Promise.all([
                Eleve.findByPk(eleveId1),
                Eleve.findByPk(eleveId2)
            ]);

            if (!eleve1 || !eleve2) {
                return res.status(404).json({ error: "Un ou plusieurs élèves non trouvés" });
            }

            if (eleve1.classe !== eleve2.classe) {
                return res.status(400).json({ error: "Les élèves ne sont pas dans la même classe" });
            }

            // Vérifier si une conversation existe déjà
            const existingConversation = await Conversation.findOne({
                include: [
                    {
                        model: Eleve,
                        as: 'participants',
                        where: {
                            id: { [Sequelize.Op.in]: [eleveId1, eleveId2] }
                        },
                        through: { where: {} },
                        required: true
                    }
                ],
                group: ['Conversation.id'],
                having: Sequelize.literal('COUNT(DISTINCT participants.id) = 2')
            });

            if (existingConversation) {
                return res.json(existingConversation);
            }

            // Créer une nouvelle conversation
            const newConversation = await Conversation.create({
                titre: `Chat entre ${eleve1.prenom} et ${eleve2.prenom}`,
                classeId: eleve1.classe,
                type: 'eleve_eleve',
                createurId: eleveId1,
                createurType: 'eleve'
            });

            // Ajouter les participants
            await newConversation.addParticipants([eleveId1, eleveId2]);

            res.status(201).json(newConversation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    });

    // Lister les conversations
    router.get('/:eleveId', validateToken, async (req, res) => {
        try {
            // 1. D'abord trouver toutes les conversations de l'élève
            const conversations = await Conversation.findAll({
                where:{type:'eleve-eleve'},
                include: [{
                    model: Eleve,
                    as: 'participants',
                    through: {
                        where: { eleveId: req.params.eleveId },
                        attributes: []
                    },
                    required: true,
                    attributes: ['id']
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
                        attributes: ['id', 'contenu', 'createdAt','envoyeurId','envoyeurType'],
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                        include: [{
                            model: Eleve,
                            as: 'envoyeur',
                            attributes: ['id', 'nom', 'prenom'],
                            required: false,
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


            // Envoyer des notifications à tous les participants (sauf l'envoyeur)
            conversations.participants.forEach(participant => {
                if (participant.id !== envoyeurId) {
                    // Déterminer le type d'utilisateur (élève ou enseignant)
                    const userType = participant.typeUtilisateur === 'Eleve' ? 'eleve' : 'enseignant';

                    sendNotification(
                        participant.id,
                        userType, // Type d'utilisateur
                        {
                            id: Date.now(),
                            title: 'Nouveau message',
                            message: `Nouveau message de ${envoyeur.prenom} ${envoyeur.nom}`,
                            type: 'message',
                            conversationId: conversationId,
                            senderId: envoyeurId,
                            date: new Date().toISOString(),
                            read: false
                        }
                    );


                }
            });




            res.status(201).json(messageWithSender);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });


    // Créer ou récupérer une conversation entre un enseignant et un élève
    router.post('/Enseignant', validateToken, async (req, res) => {
        try {
            const { enseignantId, eleveId } = req.body;
            console.log("Requête reçue avec IDs:", enseignantId, eleveId);

            // 1. Vérifier que les IDs sont valides
            if (!enseignantId || !eleveId) {
                return res.status(400).json({ error: "IDs manquants" });
            }

            // 2. Trouver les participants avec vérification d'existence
            const [enseignant, eleve] = await Promise.all([
                Enseignant.findByPk(enseignantId),
                Eleve.findByPk(eleveId, {
                    include: [{
                        model: Classe,
                        as: 'classeEleve'
                    }]
                })
            ]);

            console.log("Participants trouvés:", enseignant?.id, eleve?.id);

            if (!enseignant || !eleve) {
                return res.status(404).json({
                    error: "Participant(s) non trouvé(s)",
                    details: {
                        enseignantExists: !!enseignant,
                        eleveExists: !!eleve
                    }
                });
            }

            // 3. Vérifier si l'enseignant donne cours dans la classe de l'élève
            const enseignantDonneCours = await Cours.findOne({
                where: {
                    Enseignant: enseignantId,
                    classe: eleve.classe
                }
            });

            if (!enseignantDonneCours) {
                return res.status(403).json({
                    error: "L'enseignant ne donne pas cours dans la classe de l'élève"
                });
            }

            // 4. Vérifier les conversations existantes
            const existingConversation = await Conversation.findOne({
                include: [
                    {
                        model: Eleve,
                        as: 'participants',
                        where: { id: eleveId },
                        attributes: [],
                        through: { attributes: [] }
                    },
                    {
                        model: Enseignant,
                        as: 'participantsEnseignants',
                        where: { id: enseignantId },
                        attributes: [],
                        through: { attributes: [] }
                    }
                ],
                where: {
                    type: 'eleve-enseignant'
                }
            });

            if (existingConversation) {
                return res.json(existingConversation);
            }

            // 5. Créer nouvelle conversation
            const conversation = await Conversation.create({
                classeId: eleve.classe,
                titre: `${enseignant.prenom} et ${eleve.prenom}`,
                type: 'eleve-enseignant'
            });

            // Ajouter les participants
            await Promise.all([
                conversation.addParticipants([eleveId]),
                conversation.addParticipantsEnseignants([enseignantId])
            ]);

            res.status(201).json(conversation);
        } catch (error) {
            console.error("Erreur complète:", error);
            res.status(500).json({
                error: 'Erreur serveur',
                details: error.message
            });
        }
    });

    // Lister les conversations pour un utilisateur (enseignant ou élève)
    router.get('/Enseignant/:userId', validateToken, async (req, res) => {
        try {
            const { userId } = req.params;
            const { typeUtilisateur } = req.utilisateur;

            let includeCondition, throughCondition;

            if (typeUtilisateur == 'Eleve') {
                includeCondition = [{
                    model: Eleve,
                    as: 'participants',
                    through: {
                        where: { eleveId: userId },
                        attributes: []
                    },
                    required: true,
                    attributes: []
                }];
            } else if (typeUtilisateur == 'Enseignant') {
                includeCondition = [{
                    model: Enseignant,
                    as: 'participantsEnseignants',
                    through: {
                        where: { enseignantId: userId },
                        attributes: []
                    },
                    required: true,
                    attributes: []
                }];
            } else {
                return res.status(403).json({ error: "Type d'utilisateur non autorisé" });
            }

            // 1. D'abord trouver toutes les conversations de l'utilisateur
            const conversations = await Conversation.findAll({
                where: {
                    type: 'eleve-enseignant'
                },
                include: includeCondition,
                raw: true
            });

            // 2. Ensuite charger les détails complets pour ces conversations
            const fullConversations = await Conversation.findAll({
                where: {
                    id: conversations.map(c => c.id),
                    type: 'eleve-enseignant'
                },
                include: [
                    {
                        model: Eleve,
                        as: 'participants',
                        attributes: ['id', 'nom', 'prenom'],
                        through: { attributes: [] },
                        include:[
                            {
                                model: Classe,
                                as:'classeEleve',
                                attributes:['id','classe']
                            }
                        ]
                    },
                    {
                        model: Enseignant,
                        as: 'participantsEnseignants',
                        attributes: ['id', 'nom', 'prenom'],
                        through: { attributes: [] }
                    },
                    {
                        model: Message,
                        as: 'messages',
                        attributes: ['id', 'contenu', 'createdAt', 'envoyeurType'],
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                        include: [
                            {
                                model: Eleve,
                                as: 'envoyeur',
                                attributes: ['id', 'nom', 'prenom'],
                                required: false
                            },
                            {
                                model: Enseignant,
                                as: 'envoyeurEnseignant',
                                attributes: ['id', 'nom', 'prenom'],
                                required: false
                            }
                        ]
                    }
                ]
            });

            // Tri des conversations par date du dernier message
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

    // Obtenir les messages d'une conversation
    router.get('/Enseignant/:conversationId/messages', validateToken, async (req, res) => {
        try {
            const messages = await Message.findAll({
                where: { conversationId: req.params.conversationId },
                include: [
                    {
                        model: Eleve,
                        as: 'envoyeur',
                        attributes: ['id', 'nom', 'prenom'],
                        required: false
                    },
                    {
                        model: Enseignant,
                        as: 'envoyeurEnseignant',
                        attributes: ['id', 'nom', 'prenom'],
                        required: false
                    }
                ],
                order: [['createdAt', 'ASC']]
            });

            // Marquer comme lus les messages reçus
            await Message.update(
                { lu: true },
                {
                    where: {
                        conversationId: req.params.conversationId,
                        [Sequelize.Op.and]: [
                            { envoyeurId: { [Sequelize.Op.ne]: req.utilisateur.id } },
                            { envoyeurType: { [Sequelize.Op.ne]: req.utilisateur.typeUtilisateur.toLowerCase() } }
                        ],
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

    // Envoyer un message dans une conversation
    router.post('/Enseignant/:conversationId/messages', validateToken, async (req, res) => {
        try {
            const { contenu } = req.body;
            const { conversationId } = req.params;
            const { id, typeUtilisateur, prenom, nom } = req.utilisateur;

            // Validation basique
            if (!contenu) {
                return res.status(400).json({ error: "Contenu requis" });
            }

            // Vérifier que l'utilisateur fait partie de la conversation
            let isParticipant = false;
            const conversation = await Conversation.findByPk(conversationId, {
                include: [
                    {
                        model: Eleve,
                        as: 'participants',
                        attributes: ['id'],
                        through: { attributes: [] }
                    },
                    {
                        model: Enseignant,
                        as: 'participantsEnseignants',
                        attributes: ['id'],
                        through: { attributes: [] }
                    }
                ]
            });

            if (!conversation) {
                return res.status(404).json({ error: "Conversation non trouvée" });
            }

            if (typeUtilisateur === 'Eleve') {
                isParticipant = conversation.participants.some(e => e.id === id);
            } else if (typeUtilisateur === 'Enseignant') {
                isParticipant = conversation.participantsEnseignants.some(e => e.id === id);
            }

            if (!isParticipant) {
                return res.status(403).json({ error: "Vous ne faites pas partie de cette conversation" });
            }

            // Créer le message
            const message = await Message.create({
                contenu,
                envoyeurId: id,
                conversationId,
                envoyeurType: typeUtilisateur.toLowerCase(),
                lu: false
            });

            // Populer les données de l'envoyeur pour la réponse
            const messageWithSender = await Message.findByPk(message.id, {
                include: [
                    {
                        model: typeUtilisateur === 'Eleve' ? Eleve : Enseignant,
                        as: typeUtilisateur === 'Eleve' ? 'envoyeur' : 'envoyeurEnseignant',
                        attributes: ['id', 'nom', 'prenom']
                    }
                ]
            });

            // Émettre l'événement socket.io
            io.to(`conv_${conversationId}`).emit('newMessage', messageWithSender);

            // Notifier tous les participants
            const participants = [
                ...conversation.participants.map(p => ({ id: p.id, type: 'eleve' })),
                ...conversation.participantsEnseignants.map(e => ({ id: e.id, type: 'enseignant' }))
            ];

            // Envoyer des notifications à tous les participants (sauf l'envoyeur)
            participants.forEach(participant => {
                if (participant.id !== id) {
                    const senderName = typeUtilisateur === 'Eleve'
                        ? `${prenom} ${nom}`
                        : `Prof. ${nom}`;

                    sendNotification(
                        participant.id,
                        participant.type,
                        {
                            id: Date.now(),
                            title: 'Nouveau message',
                            message: `Nouveau message de ${senderName}`,
                            type: 'message',
                            conversationId: conversationId,
                            senderId: id,
                            date: new Date().toISOString(),
                            read: false
                        }
                    );
                }
            });

            res.status(201).json(messageWithSender);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    // Envoyer une annonce à une classe
    router.post('/annonce', validateToken, async (req, res) => {
        try {
            const { contenu, classeId } = req.body;
            const enseignantId = req.utilisateur.id;

            // Vérifier que l'enseignant est responsable de cette classe
            const classe = await Classe.findOne({
                where: {
                    id: classeId,
                    responsable: enseignantId
                }
            });

            if (!classe) {
                return res.status(403).json({
                    error: "Vous n'êtes pas responsable de cette classe ou la classe n'existe pas"
                });
            }

            // Trouver tous les élèves de la classe
            const eleves = await Eleve.findAll({
                where: { classe: classeId },
                attributes: ['id']
            });

            if (!eleves.length) {
                return res.status(404).json({ error: "Aucun élève dans cette classe" });
            }

            // Créer une conversation spéciale pour l'annonce
            const conversation = await Conversation.create({
                titre: `Annonce - ${classe.classe}`,
                classeId: classeId,
                type: 'annonce',
                createurId: enseignantId,
                createurType: 'enseignant',
                estAnnonce: true
            });

            // Ajouter l'enseignant et les élèves comme participants
            await Promise.all([
                conversation.addParticipantsEnseignants([enseignantId]),
                conversation.addParticipants(eleves.map(e => e.id))
            ]);

            // Créer le message d'annonce
            const message = await Message.create({
                contenu,
                envoyeurId: enseignantId,
                conversationId: conversation.id,
                envoyeurType: 'enseignant',
                estAnnonce: true
            });

            // Formater la réponse
            const result = {
                ...message.toJSON(),
                conversationId: conversation.id,
                classe: {
                    id: classe.id,
                    nom: classe.classe
                }
            };

            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

// Récupérer les annonces pour un élève
    router.get('/annonce/:eleveId', validateToken, async (req, res) => {
        try {
            const { eleveId } = req.params;

            const annonces = await Conversation.findAll({
                where: {
                    type: 'annonce',
                    estAnnonce: true
                },
                include: [
                    {
                        model: Eleve,
                        as: 'participants',
                        where: { id: eleveId },
                        attributes: [],
                        through: { attributes: [] }
                    },
                    {
                        model: Message,
                        as: 'messages',
                        where: { estAnnonce: true },
                        limit: 1,
                        order: [['createdAt', 'DESC']]
                    },
                    {
                        model: Classe,
                        attributes: ['id', 'classe']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json(annonces);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

// Modifiez la route /annonceInst
    router.post('/annonceInst', validateToken, upload.single('file'), async (req, res) => {
        try {
            const { contenu, classeId } = req.body;
            const enseignantId = req.utilisateur.id;
            const fichierJoint = req.file ? req.file.filename : null;

            // Vérification des permissions
            const classe = await Classe.findOne({
                where: { id: classeId, responsable: enseignantId },
                include: [{
                    model: Enseignant,
                    as:'ResponsableClasse',
                    attributes: ['id', 'nom', 'prenom']
                }]
            });

            if (!classe) {
                // Supprimer le fichier uploadé si la permission est refusée
                if (fichierJoint) {
                    fs.unlinkSync(path.join(__dirname, '../uploads', fichierJoint));
                }
                return res.status(403).json({ error: "Action non autorisée" });
            }

            // Création du message
            const [conversation] = await Conversation.findOrCreate({
                where: { classeId, type: 'annonce' },
                defaults: {
                    titre: `Annonces - ${classe.classe}`,
                    createurId: enseignantId,
                    createurType: 'enseignant'
                }
            });

            const message = await Message.create({
                contenu,
                envoyeurId: enseignantId,
                conversationId: conversation.id,
                envoyeurType: 'enseignant',
                estAnnonce: true,
                fichierJoint
            });

            // Récupération complète du message avec les relations
            const fullMessage = await Message.findOne({
                where: { id: message.id },
                include: [{
                    model: Enseignant,
                    as: 'envoyeurEnseignant',
                    attributes: ['id', 'nom', 'prenom']
                }]
            });

            // Émission Socket.IO
            io.to(`classe_${classeId}`).emit('nouvelle_annonce', {
                ...fullMessage.toJSON(),
                classeId: classe.id,
                classe: classe.classe,
                envoyeurEnseignant: {
                    prenom: classe.ResponsableClasse.prenom,
                    nom: classe.ResponsableClasse.nom
                }
            });

            res.status(201).json(fullMessage);

        } catch (error) {
            console.error(error);
            // Supprimer le fichier uploadé en cas d'erreur
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, '../uploads', req.file.filename));
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
    // Récupérer l'historique des annonces par classe
    router.get('/annonceClasse/:classeId', validateToken, async (req, res) => {
        try {
            const { classeId } = req.params;
            const enseignantId = req.utilisateur.id;

            // Vérifier que l'enseignant est responsable
            const isResponsable = await Classe.count({
                where: {
                    id: classeId,
                    responsable: enseignantId
                }
            });

            if (!isResponsable) {
                return res.status(403).json({
                    error: "Action non autorisée"
                });
            }

            // Récupérer la conversation d'annonces
            const conversation = await Conversation.findOne({
                where: {
                    classeId,
                    type: 'annonce'
                },
                include: [{
                    model: Message,
                    as: 'messages',
                    where: { estAnnonce: true },
                    order: ['createdAt', 'DESC'],
                    include: [{
                        model: Enseignant,
                        as: 'envoyeurEnseignant',
                        attributes: ['id', 'nom', 'prenom']
                    }]
                }]
            });

            if (!conversation) {
                return res.json([]);
            }

            // Ajouter l'URL de téléchargement pour chaque message avec fichier
            const messagesWithDownload = conversation.messages.map(message => {
                if (message.fichierJoint) {
                    return {
                        ...message.toJSON(),
                        downloadUrl: `${config.api.baseUrl}/download/${message.fichierJoint}`
                    };
                }
                return message.toJSON();
            });

            res.json(messagesWithDownload);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    router.get('/download/:filename', validateToken, async (req, res) => {
        try {
            const { filename } = req.params;
            const uploadDir = path.join(__dirname, '../uploads');
            const filePath = path.join(uploadDir, filename);

            console.log(`Tentative de téléchargement: ${filePath}`); // Log de débogage

            // Vérifier que le fichier existe
            if (!fs.existsSync(filePath)) {
                console.error(`Fichier non trouvé: ${filePath}`);
                return res.status(404).json({ error: 'Fichier non trouvé' });
            }

            // Vérification des permissions
            const message = await Message.findOne({ where: { fichierJoint: filename } });
            if (!message) {
                return res.status(404).json({ error: 'Message non trouvé' });
            }

            const conversation = await Conversation.findByPk(message.conversationId);


            // Envoyer le fichier avec le bon Content-Type
            res.download(filePath, filename, (err) => {
                if (err) {
                    console.error('Erreur lors du téléchargement:', err);
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Erreur de serveur' });
                    }
                }
            });

        } catch (error) {
            console.error('Erreur:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
    // Nouvelle route pour les élèves
    router.get('/annonceClasseEleve/:classeId', validateToken, async (req, res) => {
        try {
            const { classeId } = req.params;

            // Vérifier que l'élève appartient à cette classe
            const eleve = await Eleve.findOne({
                where: {
                    id: req.utilisateur.id,
                    classe:classeId,
                }
            });

            if (!eleve) {
                return res.status(403).json({
                    error: "Vous n'êtes pas dans cette classe"
                });
            }

            // Récupérer la conversation d'annonces
            const conversation = await Conversation.findOne({
                where: {
                    classeId,
                    type: 'annonce'
                },
                include: [{
                    model: Message,
                    as: 'messages',
                    where: { estAnnonce: true },
                    order: [['createdAt', 'DESC']],
                    include: [{
                        model: Enseignant,
                        as: 'envoyeurEnseignant',
                        attributes: ['id', 'nom', 'prenom']
                    }]
                }]

            });

            if (!conversation) {
                return res.json([]);
            }
            console.log("les messages dans le backend sont",conversation.messages);

            res.json(conversation.messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });
    return router;
};