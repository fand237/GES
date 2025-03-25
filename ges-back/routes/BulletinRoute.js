// NoteRoute.js

const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { Annee_Academique, Eleve, Note, Cours, Sequence, Type_Evaluation, Classe, Enseignant, Bulletin, Groupe , Moyenne, MoyenneGenerale,MoyenneClasse} = require('../models');


// Route pour créer une nouvelle Bulletin
router.post("/", async (req, res) => {

  const post = req.body;
  await Bulletin.create(post);
  res.json(post);
});



router.get("/byeleve/:idEleve/:idSequence", async (req, res) => {
  const idEleve = req.params.idEleve;
  const idSequence = req.params.idSequence;



  try {
    const distinctElements = await Bulletin.findAll({
      attributes: ['eleve', 'note', 'annee','cours'],
      include: [
        {
          model: Eleve,
          attributes: ['nom', 'prenom', 'dateNaissance'],
          as: 'eleveBulletin',
          where: { id: idEleve },
          include: [{ model: Classe, attributes: ['classe'], as: 'classeEleve' ,
          include :[{ model:Enseignant, attributes:['nom','civilite', 'prenom'],  as:'ResponsableClasse'}]}
          ]
        },
        {
          model: Note,
          attributes: ['note', 'dateEvaluation'],
          as: 'noteBulletin',
          where: { sequence: idSequence },
          include: [
            {
              model: Cours,
              attributes: ['matiere', 'coefficient'],
              as: 'coursNote',
              include: [
                { model: Enseignant, attributes: ['nom', 'prenom'], as: 'enseignant' },
                { model: Groupe, attributes: ['groupe'], as: 'groupeCours' }
              ]
            },
            { model: Type_Evaluation, attributes: ['type'], as: 'TypeNote' },
            { model: Sequence, attributes: ['sequence'], as: 'sequenceNote' },
            {
              model: Moyenne,
              as: 'moyenneNote',
              attributes: ['moyenne','moyennePonderee'],
              where: { sequence: idSequence ,eleve: idEleve},
              required: false, // Permet d'inclure même s'il n'y a pas encore de moyenne
            }
          ]
        },
        { model: Annee_Academique, attributes: ['annee'], as: 'anneeBulletin' }
      ],
      order: [
        [{ model: Note, as: 'noteBulletin' }, { model: Cours, as: 'coursNote' }, 'groupe', 'ASC'],
        [{ model: Note, as: 'noteBulletin' }, { model: Cours, as: 'coursNote' }, 'matiere', 'ASC'],
        [{ model: Note, as: 'noteBulletin' }, 'TypeNote', 'type', 'ASC']
      ]
    });


    console.log("la requete est ",distinctElements);
// Récupérer la moyenne générale pour l'élève et la séquence
    const moyenneGenerale = await MoyenneGenerale.findOne({
      where: { eleve: idEleve, sequence: idSequence },
      attributes: ['moyenne','rang'],
    });

    //Récupérer la classw de l'eleve
    const classe = await Eleve.findOne({
      where: { id: idEleve},
      attributes: ['classe'],
    });
    console.log("les donnees de l'eleve",classe);
    const idClasse = classe.classe;

    // Récupérer l'année académique active (2024-2025)
    const anneeAcademique = await Annee_Academique.findOne({
      where: { annee: '2024-2025' },
    });

    if (!anneeAcademique) {
      return res.status(400).json({ error: 'Aucune année académique active trouvée' });
    }

    const idannee = anneeAcademique.id; // ID de l'année académique

    // Récupérer la moyenne de la classe
    const moyenneClasse = await MoyenneClasse.findOne({
      where: { classe: idClasse, sequence: idSequence,annee:idannee },
      attributes: ['moyenneClasse','moyennePremier','moyenneDernier'],
    });

    // Récupérer l'effectif de la classe
    const effectifClasse = await Eleve.count({
      where: { classe: idClasse },
    });

    if (!distinctElements.length) {
      console.log("aucune donne trouve");
      return res.status(404).json({ message: 'Aucune donnée trouvée' });
    }

    // Convertir les instances Sequelize en objets JSON
    const plainObjects = distinctElements.map(element => element.get({ plain: true }));

    const getMatiere = (element) => element.noteBulletin?.coursNote?.matiere || 'Inconnu';


    // Regrouper par matière en utilisant JavaScript natif
    const groupedByMatiere = plainObjects.reduce((acc, element) => {
      const matiere = getMatiere(element);
      if (!acc[matiere]) {
        acc[matiere] = [];
      }
      acc[matiere].push(element);
      return acc;
    }, {});



    // Fusionner les lignes ayant la même matière
    const mergedResults = Object.values(groupedByMatiere).map((group) => {
      // Combine toutes les propriétés sauf pour la liste des éléments
      const mergedElement = { ...group[0] }; // On peut utiliser le premier élément comme base

      // Créer une liste pour stocker les informations de chaque élément
      mergedElement.elements = group.map((element) => {
        // Supprimer la propriété noteBulletin.coursNote.matiere de chaque élément
        const { noteBulletin: { coursNote: { matiere, ...restCoursNote }, ...restNoteBulletin }, ...restElement } = element;
        return { ...restElement, noteBulletin: { ...restNoteBulletin, coursNote: { ...restCoursNote } } };
      });



      return mergedElement;
    });

    res.status(200).json({
      moyenneGenerale: moyenneGenerale ? moyenneGenerale : null, // Retourne la moyenne générale
      moyenneClasse: moyenneClasse ? moyenneClasse : null, // Retourne la moyenne générale
      effectifClasse: effectifClasse, // Ajout de l'effectif de la classe
      bulletin:mergedResults
    });



  } catch (error) {
    console.error('Erreur lors de la récupération des éléments distincts :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des éléments distincts.' });
  }
});


router.get("/byclasse/:idClasse/:idSequence", async (req, res) => {
  const idClasse = req.params.idClasse;
  const idSequence = req.params.idSequence;

  try {
    const distinctElements = await Bulletin.findAll({
      attributes: ['eleve', 'note'],
      include: [
        { model: Eleve, attributes: ['nom', 'prenom', 'dateNaissance'], as: 'eleveBulletin', include: [{ model: Classe, attributes: ['classe'], as: 'classeEleve', where: { id: idClasse }, }] }, // Utilisez l'alias 'coursNote' correspondant à votre association
        { model: Note, attributes: ['note', 'dateEvaluation'], as: 'noteBulletin', where: { sequence: idSequence }, include: [{ model: Cours, attributes: ['matiere', 'coefficient'], as: 'coursNote', include: [{ model: Enseignant, attributes: ['nom', 'prenom'], as: 'enseignant' }, { model: Groupe, attributes: ['groupe'], as: 'groupeCours' }] }, { model: Type_Evaluation, attributes: ['type'], as: 'TypeNote' }, { model: Sequence, attributes: ['sequence'], as: 'sequenceNote' }], }, // Utilisez l'alias 'sequenceNote' correspondant à votre association
      ],

    });
    res.status(200).json(distinctElements);
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments distincts :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des éléments distincts.' });
  }
});
// A

// Autres routes CRUD à ajouter selon les besoins

module.exports = router;
