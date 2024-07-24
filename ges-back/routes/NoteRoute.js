// NoteRoute.js

const express = require('express');
const router = express.Router();
const { Note, Moyenne, Cours, Sequence, Type_Evaluation, Classe, Bulletin } = require('../models');
const {validateToken} = require("../middlewares/AuthMiddleware")


// Route pour créer une nouvelle note
router.post('/', validateToken, async (req, res) => {
  try {
    let { eleve, cours, note, dateEvaluation, type_Evaluation, sequence } = req.body;

    // Recherche d'une instance existante
    const existingInstance = await Note.findOne({
      where: {
        eleve,
        cours,
        type_Evaluation,
        sequence,
      },
    });

    if (existingInstance) {
      if (note == '') { note = null; }
      // Si l'instance existe, mettez à jour la note
      existingInstance.note = note;
      await existingInstance.save();
    } else {
      if (note == '') { note = null; }
      // Sinon, créez une nouvelle instance de note
      const newNote = await Note.create({ eleve, cours, note, dateEvaluation, type_Evaluation, sequence });

      // Vérifiez si les valeurs requises pour la création du Bulletin sont disponibles
      const idnote = newNote.id;
      const idannee = 1; // Vous devez ajuster cela pour obtenir la bonne année

      if (idnote && idannee) {
        // Recherche d'un bulletin existant pour éviter les doublons
        const existingBulletin = await Bulletin.findOne({
          where: {
            eleve,
            note: idnote,
            annee: idannee,
          },
        });

        if (!existingBulletin) {
          await Bulletin.create({ eleve, note: idnote, annee: idannee });
        } else {
          console.log('Le bulletin existe déjà.');
        }
      } else {
        console.error('Valeurs manquantes pour la création du Bulletin.');
      }
    }

    res.json({ message: 'Mise à jour ou création réussie' });

  } catch (error) {
    console.error('Erreur lors de la création de la note :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la note' });
  }
});

router.get("/forupdate/:coursId/:sequenceId/:typeEvaluationId/:date", async (req, res) => {
  const { coursId, sequenceId, typeEvaluationId, date } = req.params
  try {
    const notes = await Note.findAll({
      where: {
        cours: coursId,
        sequence: sequenceId,
        type_Evaluation: typeEvaluationId,
        dateEvaluation: date,
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes existantes :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes existantes.' });

  }



});

router.get("/byeval/:idEnseignant", async (req, res) => {
  const idEnseignant = req.params.idEnseignant;

  try {
    const distinctElements = await Note.findAll({
      attributes: ['cours', 'sequence', 'type_Evaluation', 'dateEvaluation'],
      include: [
        { model: Cours, attributes: ['id', 'matiere', 'Enseignant'], as: 'coursNote', include: [{ model: Classe, as: 'classeCours' }], where: { Enseignant: idEnseignant } }, // Utilisez l'alias 'coursNote' correspondant à votre association
        { model: Sequence, attributes: ['sequence'], as: 'sequenceNote' }, // Utilisez l'alias 'sequenceNote' correspondant à votre association
        { model: Type_Evaluation, attributes: ['type'], as: 'TypeNote' }, // Utilisez l'alias 'typeEvaluationNote' correspondant à votre association
      ],
      group: ['cours', 'sequence', 'type_Evaluation', 'dateEvaluation'],
      raw: true,
      nest: true,
    });
    res.status(200).json(distinctElements);
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments distincts :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des éléments distincts.' });
  }
});
// Autres routes CRUD à ajouter selon les besoins

module.exports = router;
