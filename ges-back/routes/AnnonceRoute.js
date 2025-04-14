// routes/AnnonceRoute.js
module.exports = (io) => {
    const router = require('express').Router();
    const { Conversation, Message, Eleve, Enseignant, Cours } = require("../models");
    const { validateToken } = require("../middlewares/AuthMiddleware");

    // Créer une annonce
    router.post('/', validateToken, async (req, res) => {
        try {
            const { enseignantId, classeId, titre, contenu } = req.body;

            // Vérifier que l'enseignant donne cours dans cette classe
            const enseignant = await Enseignant.findByPk(enseignantId, {
                include: [{
                    model: Cours,
                    as: 'cours',
                    where: { classe: classeId }
                }]
            });

            if (!enseignant) {
                return res.status(403).json({
                    error: "Vous n'enseignez pas dans cette classe"
                });
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
            const eleves = await Eleve.findAll({
                where: { classe: classeId },
                attributes: ['id']
            });
            await conversation.addParticipantsEleves(eleves);

            // Émettre l'événement Socket.io
            io.to(`conv_${conversation.id}`).emit('newAnnonce', {
                conversation: {
                    id: conversation.id,
                    titre: conversation.titre,
                    type: conversation.type,
                    createdAt: conversation.createdAt
                },
                message: {
                    id: message.id,
                    contenu: message.contenu,
                    createdAt: message.createdAt,
                    envoyeurEleve: {
                        id: enseignant.id,
                        nom: enseignant.nom,
                        prenom: enseignant.prenom
                    }
                }
            });

            res.status(201).json({
                success: true,
                conversation,
                message
            });
        } catch (error) {
            console.error('Erreur création annonce:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur serveur',
                details: error.message
            });
        }
    });

    // Lister les annonces d'une classe
    router.get('/classe/:classeId', validateToken, async (req, res) => {
        try {
            const annonces = await Conversation.findAll({
                where: {
                    classeId: req.params.classeId,
                    type: 'annonce'
                },
                include: [
                    {
                        model: Message,
                        as: 'messages',
                        where: { estAnnonce: true },
                        limit: 1,
                        order: [['createdAt', 'DESC']],
                        include: [{
                            model: Enseignant,
                            as: 'envoyeurEnseignant',
                            attributes: ['id', 'nom', 'prenom']
                        }]
                    },
                    {
                        model: Enseignant,
                        as: 'participantsEnseignants',
                        attributes: ['id', 'nom', 'prenom']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                annonces: annonces.map(annonce => ({
                    id: annonce.id,
                    titre: annonce.titre,
                    createdAt: annonce.createdAt,
                    message: annonce.messages[0],
                    createur: annonce.createurEnseignant
                }))
            });
        } catch (error) {
            console.error('Erreur récupération annonces:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur serveur'
            });
        }
    });

    // Récupérer une annonce spécifique
    router.get('/:annonceId', validateToken, async (req, res) => {
        try {
            const annonce = await Conversation.findByPk(req.params.annonceId, {
                where: { type: 'annonce' },
                include: [
                    {
                        model: Message,
                        as: 'messages',
                        where: { estAnnonce: true },
                        include: [{
                            model: Enseignant,
                            as: 'envoyeurEnseignant',
                            attributes: ['id', 'nom', 'prenom']
                        }]
                    },
                    {
                        model: Enseignant,
                        as: 'createurEnseignant',
                        attributes: ['id', 'nom', 'prenom']
                    }
                ]
            });

            if (!annonce) {
                return res.status(404).json({
                    success: false,
                    error: 'Annonce non trouvée'
                });
            }

            res.json({
                success: true,
                annonce: {
                    id: annonce.id,
                    titre: annonce.titre,
                    createdAt: annonce.createdAt,
                    messages: annonce.messages,
                    createur: annonce.createurEnseignant
                }
            });
        } catch (error) {
            console.error('Erreur récupération annonce:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur serveur'
            });
        }
    });

    // Supprimer une annonce
    router.delete('/:annonceId', validateToken, async (req, res) => {
        try {
            const annonce = await Conversation.findByPk(req.params.annonceId);

            if (!annonce || annonce.type !== 'annonce') {
                return res.status(404).json({
                    success: false,
                    error: 'Annonce non trouvée'
                });
            }

            // Vérifier que l'utilisateur est le créateur de l'annonce
            if (annonce.createurId !== req.utilisateur.id || annonce.createurType !== 'enseignant') {
                return res.status(403).json({
                    success: false,
                    error: 'Vous ne pouvez pas supprimer cette annonce'
                });
            }

            await annonce.destroy();

            // Émettre l'événement de suppression
            io.emit('annonce_deleted', { id: annonce.id });

            res.json({
                success: true,
                message: 'Annonce supprimée avec succès'
            });
        } catch (error) {
            console.error('Erreur suppression annonce:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur serveur'
            });
        }
    });

    return router;
};