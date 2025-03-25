// routes/niveau.js
const express = require('express');
const router = express.Router();
const { Niveau } = require('../models');
const { validateToken } = require("../middlewares/AuthMiddleware");

// Obtenir tous les niveaux
router.get('/', validateToken, async (req, res) => {
    try {
        const niveaux = await Niveau.findAll({
            order: [['nom', 'ASC']]
        });
        res.json(niveaux);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des niveaux' });
    }
});

// Créer un nouveau niveau
router.post('/', validateToken, async (req, res) => {
    try {
        const { nom, description } = req.body;
        const newNiveau = await Niveau.create({ nom, description });
        res.status(201).json(newNiveau);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du niveau' });
    }
});

// ... (autres routes CRUD pour Niveau)

module.exports = router;