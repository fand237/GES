// NoteRoute.js
const { fn, col } = require('sequelize');
const express = require('express');
const router = express.Router();
const { Note, Moyenne, Cours, Sequence, Type_Evaluation, Classe, Bulletin, Annee_Academique, Eleve} = require('../models');
const {validateToken} = require("../middlewares/AuthMiddleware")


router.post('/', validateToken,async (req, res) => {



  try {

    let { eleve, cours, note, dateEvaluation, type_Evaluation, sequence } = req.body;
    console.log(req.utilisateur)

    // Récupérer l'année académique active (2024-2025)
    const anneeAcademique = await Annee_Academique.findOne({
      where: { annee: '2024-2025' },
    });

    if (!anneeAcademique) {
      return res.status(400).json({ error: 'Aucune année académique active trouvée' });
    }

    const idannee = anneeAcademique.id; // ID de l'année académique

    const isOverlap = await Eleve.checkOverlapEmail(eleve,cours,type_Evaluation,sequence,idannee);

    // Si l'unicité n'est pas respectée, renvoyer une réponse avec le statut 422
    if (isOverlap) {
      return res.status(422).json({ error: "Cette adresse Note est déjà utilisée." });
    }

    // Recherche d'une instance existante
    const existingInstance = await Note.findOne({
      where: {
        eleve,
        cours,
        type_Evaluation,
        sequence,
        annee:idannee,

      },
    });

    if (existingInstance) {

      if (note == '') { note = null }
      // Si l'instance existe, mettez à jour le statut
      existingInstance.note = note;

      await existingInstance.save();
    } else {
      if (note == '') { note = null }
      // Sinon, créez une nouvelle instance
      console.log("la note n'exitste pas donc on va creer");
      const newNote = await Note.create({ eleve, cours, note, dateEvaluation, type_Evaluation, sequence , annee: idannee, // Ajout de l'année académique
      });
      const idnote = newNote.id;

      console.log("l'id de la note cree est ",idnote);
      // Vérifiez si les valeurs requises pour la création du Bulletin sont disponibles
        const newbuletin = await Bulletin.create({ eleve, note: idnote, annee: idannee,cours: cours});

      if (newbuletin){
        console.log("bulletin cree avec succes");
      }else{
        console.log("bulletin non cree");
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
      attributes: [[fn('MIN', col('Note.id')), 'id'], 'cours', 'sequence', 'type_Evaluation', 'dateEvaluation','annee'],
      include: [
        { model: Cours, attributes: ['id', 'matiere', 'Enseignant'], as: 'coursNote', include: [{ model: Classe, as: 'classeCours' }], where: { Enseignant: idEnseignant } },
        { model: Sequence, attributes: ['sequence'], as: 'sequenceNote' },
        { model: Type_Evaluation, attributes: ['type'], as: 'TypeNote' },
      ],
      group: ['cours', 'sequence', 'type_Evaluation', 'dateEvaluation','annee'],
      raw: true,
      nest: true,
    });
    console.log("les elements distincts des eval sont ",distinctElements);
    res.status(200).json(distinctElements);
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments distincts :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des éléments distincts.' });
  }
});

router.delete('/:id', validateToken, async (req, res) => {
  const id = req.params.id; // Récupérer l'ID de la note à supprimer

  try {
    // Rechercher la note par son ID
    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }

    // Supprimer la note
    await note.destroy();

    res.status(204).end(); // Réponse 204 No Content pour indiquer une suppression réussie
  } catch (error) {
    console.error('Erreur lors de la suppression de la note :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la note' });
  }
});



module.exports = router;
