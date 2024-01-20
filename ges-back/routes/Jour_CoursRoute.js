const express = require('express');
const router = express.Router();
const JourCoursController = require('../controllers/Jour_CoursController');
const {Jour_Cours, Cours} = require("../models")



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



module.exports = router;