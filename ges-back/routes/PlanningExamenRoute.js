// routes/planningExamen.js
const express = require('express');
const router = express.Router();
const { PlanningExamen, Cours, Niveau } = require('../models');
const { validateToken } = require("../middlewares/AuthMiddleware");

// Sauvegarde du planning par niveau
router.post('/', validateToken, async (req, res) => {
    const { planning, sequenceId, anneeAcademiqueId } = req.body;

    if (!sequenceId || !anneeAcademiqueId || !planning?.[0]?.niveauId) {
        return res.status(400).json({
            message: 'SequenceId, AnneeAcademiqueId et niveauId sont obligatoires'
        });
    }

    try {
        // Suppression des anciens plannings pour ce niveau
        await PlanningExamen.destroy({
            where: {
                SequenceId: sequenceId,
                AnneeAcademiqueId: anneeAcademiqueId,
                niveauId: planning[0].niveauId
            }
        });

        // Création des nouvelles entrées
        const createdPlannings = await Promise.all(
            planning.map(async (tranche) => {
                return await PlanningExamen.create({
                    date: tranche.date,
                    heureDebut: tranche.heureDebut,
                    heureFin: tranche.heureFin,
                    duree: parseInt(tranche.duree),
                    matiere: tranche.matiereId,
                    niveauId: tranche.niveauId,
                    SequenceId: sequenceId,
                    AnneeAcademiqueId: anneeAcademiqueId
                });
            })
        );

        res.status(201).json(createdPlannings);
    } catch (error) {
        console.error('Erreur sauvegarde planning:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupération des plannings par niveau
router.get('/', validateToken, async (req, res) => {
    const { sequenceId, anneeAcademiqueId, niveauId } = req.query;

    if (!sequenceId || !anneeAcademiqueId || !niveauId) {
        return res.status(400).json({
            message: 'Les paramètres sequenceId, anneeAcademiqueId et niveauId sont obligatoires'
        });
    }

    try {
        const plannings = await PlanningExamen.findAll({
            where: {
                SequenceId: sequenceId,
                AnneeAcademiqueId: anneeAcademiqueId,
                niveauId: niveauId
            },
            include: [
                {
                    model: Cours,
                    as: 'Matiere',
                    attributes: ['matiere']
                },
                {
                    model: Niveau,
                    as: 'Niveau',
                    attributes: ['nom']
                }
            ],
            attributes: {
                exclude: ['classe'] // Explicitez les champs à exclure
            },
            order: [
                ['date', 'ASC'],
                ['heureDebut', 'ASC']
            ]
        });

        // Formatage des résultats
        const formatted = plannings.map(p => ({
            ...p.get({ plain: true }),
            matiereNom: p.Matiere?.matiere || p.matiere,
            matiereId: p.matiere,
            niveauNom: p.Niveau?.nom || p.niveauId
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Erreur récupération planning:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;