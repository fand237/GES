const express = require('express');
const router = express.Router();
const JourCoursController = require('../controllers/Jour_CoursController');
const {Jour_Cours, Cours,Eleve, Classe, Enseignant} = require("../models")
const {validateToken} = require("../middlewares/AuthMiddleware")



// Route pour créer un cours pour un jour spécifique
router.post('/create', JourCoursController.createJour_Cours);

router.get("/byens/:ens", async (req, res) => {
  const ensid = req.params.ens;

  try {
    const courses = await Jour_Cours.findAll({
      include: [
        {
          model: Cours,
          where: { Enseignant: ensid },
          as: 'coursDetails',
        },
      ],
    });

    res.json(courses);
  } catch (error) {
    console.error("Erreur lors de la récupération des Jour_Cours par enseignant : ", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des Jour_Cours par enseignant" });
  }
});

router.get("/byemplois/:emplois", async (req, res) => {
    const emploiid = req.params.emplois;
  
    try {
      // Utilisez findAll avec une condition where pour récupérer les Jour_Cours de l'enseignant spécifié
      const courses = await Jour_Cours.findAll({
        where: { emploisTemps: emploiid },
      });
  
      res.json(courses);
    } catch (error) {
      console.error("Erreur lors de la récupération des Jour_Cours par emplois de temps : ", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des Jour_Cours par emplois de temps" });
    }
  });

  // Route pour supprimer un Jour_Cours
router.delete('/:id', JourCoursController.deleteJour_Cours);

// Route pour supprimer un Jour_Cours par cours
router.delete('/bycours/:id', JourCoursController.deleteCours);

router.get("/byele/:ele", validateToken, async (req, res) => {
  const eleveId = req.params.ele;

  try {
    // 1. Récupérer l'élève et sa classe
    const eleve = await Eleve.findOne({
      where: { id: eleveId },
      attributes:['nom', 'prenom'],
      include: [{
        model: Classe,
        as: 'classeEleve',
        attributes: ['id']
      }]
    });

    if (!eleve) {
      return res.status(404).json({ error: "Élève non trouvé" });
    }

    if (!eleve.classeEleve) {
      return res.status(400).json({ error: "L'élève n'est pas affecté à une classe" });
    }

    const classeId = eleve.classeEleve.id;

    // 2. Récupérer les cours de la classe
    const jourCours = await Jour_Cours.findAll({
      include: [{
        model: Cours,
        as: 'coursDetails',
        where: { classe: classeId },
        include: [{
          model: Enseignant,
          as: 'enseignant',
          attributes: ['id', 'nom', 'prenom']
        }]
      }],
      order: [
        ['jour', 'ASC'],
        ['heureDebut', 'ASC']
      ]
    });

    // 3. Formater la réponse
    const response = jourCours.map(jc => ({
      id: jc.id,
      jour: jc.jour,
      heureDebut: jc.heureDebut,
      heureFin: jc.heureFin,
      nom:eleve.nom,
      prenom:eleve.prenom,
      cours: {
        id: jc.coursDetails.id,
        matiere: jc.coursDetails.matiere,
        enseignant: jc.coursDetails.enseignant
      }
    }));

    res.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours par élève : ", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des cours" });
  }
});


module.exports = router;