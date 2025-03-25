// controllers/PlanningExamenController.js

const { PlanningExamen, Sequence, Annee_Academique, Cours, Classe } = require('../models');

const createPlanningExamen = async (req, res) => {
    const { date, heureDebut, heureFin, duree, matiereId, classeId, sequenceId, anneeAcademiqueId } = req.body;

    try {
        // Vérifier si la séquence, l'année académique, la matière et la classe existent
        const sequence = await Sequence.findByPk(sequenceId);
        const anneeAcademique = await Annee_Academique.findByPk(anneeAcademiqueId);
        const matiere = await Cours.findByPk(matiereId);
        const classe = await Classe.findByPk(classeId);

        if (!sequence || !anneeAcademique || !matiere || !classe) {
            return res.status(404).json({ message: 'Séquence, année académique, matière ou classe introuvable' });
        }

        // Créer le planning
        const planning = await PlanningExamen.create({
            date,
            heureDebut,
            heureFin,
            duree,
            matiere: matiereId,
            classe: classeId,
            SequenceId: sequenceId,
            AnneeAcademiqueId: anneeAcademiqueId,
        });

        res.status(201).json(planning);
    } catch (error) {
        console.error('Erreur lors de la création du planning : ', error);
        res.status(500).json({ message: 'Erreur lors de la création du planning' });
    }
};

module.exports = {
    createPlanningExamen,
};