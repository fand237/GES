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

    io.on('connection', (socket) => {
        console.log('Nouvelle connexion:', socket.id);

        // Authentification
        socket.on('authenticate', (token) => {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                activeUsers.set(decoded.id, socket.id);
                console.log(`Utilisateur ${decoded.id} authentifié`);
                socket.join(`user_${decoded.id}`);
            } catch (error) {
                console.error('Authentification échouée:', error);
                socket.disconnect();
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
            io.to(`conv_${messageData.conversationId}`).emit('newMessage', messageData);
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

    return io;
};