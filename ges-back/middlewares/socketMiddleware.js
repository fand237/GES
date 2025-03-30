// middleware/socketMiddleware.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { Conversation, Eleve, Message } = require("../models");

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



        // Authentification via token
        socket.on('authenticate', (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
            // Juste retransmettre, la création est gérée par la route API
// Vérification basique
            if (!messageData.conversationId || !messageData.envoyeurId) {
                return socket.emit('error', 'Données manquantes');
            }

            // Diffusion à la conversation
            io.to(`conv_${messageData.conversationId}`).emit('newMessage', messageData);

            // Envoyer une notification aux autres participants
            Conversation.findByPk(messageData.conversationId, {
                include: [{
                    model: Eleve,
                    as: 'participants',
                    attributes: ['id'],
                    through: { attributes: [] }
                }]
            }).then(conversation => {
                conversation.participants.forEach(participant => {
                    if (participant.id !== messageData.envoyeurId) {
                        sendNotification(participant.id, {
                            title: 'Nouveau message',
                            message: `Vous avez reçu un nouveau message dans une conversation`,
                            type: 'message',
                            conversationId: messageData.conversationId
                        });
                    }
                });
            });
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