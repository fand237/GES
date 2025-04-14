// middleware/socketMiddleware.js
const { Server } = require('socket.io');
const { verify } = require("jsonwebtoken")
const { Conversation, Eleve, Enseignant,Message } = require("../models");

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true
        }
    });

    const activeUsers = new Map();
    const userNotifications = new Map();

    // Fonction pour envoyer des notifications
    const sendNotification = (userId, userType, notification) => {
        const socketId = activeUsers.get(`${userType}_${userId}`);
        if (socketId) {
            io.to(socketId).emit('newNotification', {
                id: Date.now(),
                ...notification,
                date: new Date(),
                read: false
            });
        } else {
            if (!userNotifications.has(userId)) {
                userNotifications.set(userId, []);
            }
            userNotifications.get(userId).push({
                id: Date.now(),
                ...notification,
                date: new Date(),
                read: false
            });
        }
    };

    io.on('connection', (socket) => {
        console.log('Nouvelle connexion:', socket.id);

        // Rejoindre la room de la classe si l'utilisateur est un élève
        socket.on('join_classe', (classeId) => {
            socket.join(`classe_${classeId}`);
        });

        socket.on('join_classe', (classeRoom) => {
            socket.join(classeRoom);
            console.log(`Utilisateur a rejoint la room ${classeRoom}`);
        });

        // Authentification via token
        socket.on('authenticate', (token) => {

            try {
                if (!token) {
                    throw new Error('Aucun token fourni');
                }
                const decoded = verify(token, "importantsecret");

                const userId = decoded.id;

                // Vérification du type d'utilisateur
                if (decoded.typeUtilisateur === 'Eleve') {
                    activeUsers.set(`eleve_${userId}`, socket.id);
                    socket.join(`user_eleve_${userId}`);
                } else if (decoded.typeUtilisateur === 'Enseignant') {
                    activeUsers.set(`enseignant_${userId}`, socket.id);
                    socket.join(`user_enseignant_${userId}`);
                }

                console.log(`Utilisateur ${userId} (${decoded.typeUtilisateur}) authentifié`);

                // Envoyer les notifications en attente
                if (userNotifications.has(userId)) {
                    const pendingNotifications = userNotifications.get(userId);
                    pendingNotifications.forEach(notification => {
                        socket.emit('newNotification', notification);
                    });
                    userNotifications.delete(userId);
                }
            } catch (error) {
                console.error('Authentification échouée:', error);
            }
        });

        // Gestion des conversations
        socket.on('joinConversation', (conversationId) => {
            socket.join(`conv_${conversationId}`);
            console.log(`Socket ${socket.id} a rejoint la conversation ${conversationId}`);
        });

        socket.on('leaveConversation', (conversationId) => {
            socket.leave(`conv_${conversationId}`);
        });

        // Gestion des messages
        socket.on('sendMessage', async (messageData) => {
            if (!messageData.conversationId || !messageData.envoyeurId || !messageData.envoyeurType) {
                return socket.emit('error', 'Données manquantes');
            }

            // Diffusion à la conversation
            io.to(`conv_${messageData.conversationId}`).emit('newMessage', messageData);

            // Envoyer une notification aux autres participants
            try {
                const conversation = await Conversation.findByPk(messageData.conversationId, {
                    include: [{
                        model: Eleve,
                        as: 'participants',
                        attributes: ['id', 'typeUtilisateur'],
                        through: { attributes: [] }
                    }]
                });

                const conversationEns = await Conversation.findByPk(messageData.conversationId, {
                    include: [{
                        model: Enseignant,
                        as: 'participantsEnseignants',
                        attributes: ['id', 'typeUtilisateur'],
                        through: { attributes: [] }
                    }]
                });

                if (!conversation) throw new Error('Conversation non trouvée');

                // Bloquer les réponses dans les annonces si l'envoyeur est un élève
                if (conversation.type === 'annonce' && messageData.envoyeurType === 'eleve') {
                    throw new Error('Les élèves ne peuvent pas répondre aux annonces');
                }

                const envoyeur = await Eleve.findByPk(messageData.envoyeurId);
                if (!envoyeur) return;

                conversationEns.participantsEnseignants.forEach(participant => {
                    if (participant.id !== messageData.envoyeurId) {
                        sendNotification(
                            participant.id,
                            participant.typeUtilisateur, // 'eleve' ou 'enseignant'
                            {
                                title: conversation.type === 'annonce' ? 'Nouvelle annonce' : 'Nouveau message',
                                message: conversation.type === 'annonce'
                                    ? `Nouvelle annonce de ${envoyeur.prenom}`
                                    : `Message de ${envoyeur.prenom}`,
                                type: conversation.type,
                                conversationId: messageData.conversationId,
                                senderId: messageData.envoyeurId
                            }
                        );
                    }
                });

                conversation.participants.forEach(participant => {
                    if (participant.id !== messageData.envoyeurId) {
                        sendNotification(
                            participant.id,
                            participant.typeUtilisateur, // 'eleve' ou 'enseignant'
                            {
                                title: conversation.type === 'annonce' ? 'Nouvelle annonce' : 'Nouveau message',
                                message: conversation.type === 'annonce'
                                    ? `Nouvelle annonce de ${envoyeur.prenom}`
                                    : `Message de ${envoyeur.prenom}`,
                                type: conversation.type,
                                conversationId: messageData.conversationId,
                                senderId: messageData.envoyeurId
                            }
                        );
                    }
                }



                );
            } catch (error) {
                console.error('Erreur lors de l\'envoi des notifications:', error);
            }
        });


        // Gestion des annonces
        socket.on('createAnnonce', async ({ enseignantId, classeId, titre, contenu }) => {
            try {
                // Vérifier que l'enseignant donne cours dans cette classe
                const enseignant = await Enseignant.findByPk(enseignantId, {
                    include: [{
                        model: Cours,
                        as: 'cours',
                        where: { classe: classeId }
                    }]
                });

                if (!enseignant) {
                    throw new Error("Vous n'enseignez pas dans cette classe");
                }

                // Créer la conversation d'annonce
                const conversation = await Conversation.create({
                    titre: titre || `Annonces de ${enseignant.nom}`,
                    classeId,
                    type: 'annonce',
                    createurId: enseignantId,
                    createurType: 'enseignant'
                });

                // Créer le message d'annonce
                const message = await Message.create({
                    contenu,
                    envoyeurId: enseignantId,
                    envoyeurType: 'enseignant',
                    conversationId: conversation.id,
                    estAnnonce: true
                });

                // Ajouter tous les élèves de la classe
                const eleves = await Eleve.findAll({ where: { classe: classeId } });
                await conversation.addParticipants(eleves);

                // Diffuser l'annonce
                io.to(`conv_${conversation.id}`).emit('newMessage', message);

                // Envoyer des notifications
                eleves.forEach(eleve => {
                    sendNotification(
                        eleve.id,
                        'eleve',
                        {
                            title: 'Nouvelle annonce',
                            message: `Nouvelle annonce dans ${conversation.titre}`,
                            type: 'annonce',
                            conversationId: conversation.id
                        }
                    );
                });

                socket.emit('annonce_created', { conversation, message });
            } catch (error) {
                console.error('Erreur createAnnonce:', error);
                socket.emit('annonce_error', { message: error.message });
            }
        });


        // Marquer une notification comme lue
        socket.on('markNotificationAsRead', (notificationId) => {
            // Implémentez la logique de marquage comme lu dans votre base de données si nécessaire
            socket.emit('notificationRead', notificationId);
        });

        // Gestion déconnexion
        socket.on('disconnect', () => {
            for (let [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    console.log(`Utilisateur ${userId} déconnecté`);
                    break;
                }
            }
        });
    });

    return {io, sendNotification};
};