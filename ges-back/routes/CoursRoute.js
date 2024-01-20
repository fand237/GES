const express = require('express')
const router = express.Router();
const {Cours} = require("../models")
const CoursController = require('../controllers/CoursController');




router.get("/", async (req, res) => {

    const listOfCours = await Cours.findAll();
    res.json(listOfCours);

});

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Cours.findByPk(id);
    res.json(post);

});

// Ajoutez une nouvelle route pour supprimer un cours par ID
router.delete("/:id", CoursController.deleteCours);


// Ajoutez une nouvelle route pour verfier le chevauchement

  router.post('/checkOverlap', async (req, res) => {
    try {
      const { jourId, plageHoraire, enseignantId, emploiTempsId } = req.body;
  
      // Utiliser la méthode statique checkOverlap du modèle Cours
      const overlap = await Cours.checkOverlap(jourId, plageHoraire, enseignantId, emploiTempsId);
  
      res.json({ overlap });
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements côté serveur : ', error);
      res.status(500).send('Erreur serveur');
    }
  });

router.get("/byens/:ens", async (req, res) => {
    const ensid = req.params.ens;
  
    try {
      // Utilisez findAll avec une condition where pour récupérer les cours de l'enseignant spécifié
      const courses = await Cours.findAll({
        where: { Enseignant: ensid },
      });
  
      res.json(courses);
    } catch (error) {
      console.error("Erreur lors de la récupération des cours par enseignant : ", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des cours par enseignant" });
    }
  });

  router.get("/byemplois/:emplois", async (req, res) => {
    const emploiid = req.params.emplois;
  
    try {
      // Utilisez findAll avec une condition where pour récupérer les cours de l'enseignant spécifié
      const courses = await Cours.findAll({
        where: { emploisTemps: emploiid },
      });
  
      res.json(courses);
    } catch (error) {
      console.error("Erreur lors de la récupération des cours par emplois de temps : ", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des cours par emplois de temps" });
    }
  });


  router.get("/byclasse/:classe", async (req, res) => {
    const classeid = req.params.classe;
  
    try {
      // Utilisez findAll avec une condition where pour récupérer les cours de la classe spécifié
      const courses = await Cours.findAll({
        where: { classe: classeid },
      });
  
      res.json(courses);
    } catch (error) {
      console.error("Erreur lors de la récupération des cours par classe : ", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des cours par classe" });
    }
  });

  router.get("/byjour/:jour", async (req, res) => {
    const jourid = req.params.jour;
  
    try {
      // Utilisez findAll avec une condition where pour récupérer les cours du jour spécifié
      const courses = await Cours.findAll({
        where: { Jour: jourid },
      });
  
      res.json(courses);
    } catch (error) {
      console.error("Erreur lors de la récupération des cours par enseignant : ", error);
      res.status(500).json({ error: "Erreur serveur lors de la récupération des cours par enseignant" });
    }
  });
  

  router.post("/", async(req, res) => {
    const post = req.body;

    console.log(post)
  
    const isOverlap = await Cours.checkOverlap(post.matiere, post.classe);

    if (isOverlap) {
      return res.status(400).json({ error: 'Chevauchement détecté. Veuillez choisir un autre emplacement.' });
    }

    try {
      const createdCours = await Cours.create(post);
      res.status(201).json(createdCours); // Répond avec le cours créé

    } catch (error) {
      console.error("Erreur lors de la création du cours : ", error);
      res.status(500).json({ error: "Erreur serveur lors de la création du cours" });
    }
  });
  

// Route pour la mise à jour d'un cours
router.put("/:id", async (req, res) => {
    const courseId = req.params.id;
    const updatedData = req.body;
  
    try {
      // Utilisez la méthode update pour mettre à jour le cours avec l'ID spécifié
      const result = await Cours.update(updatedData, {
        where: { id: courseId },
      });
  
      // result[0] contient le nombre de lignes mises à jour
      if (result[0] > 0) {
        res.json({ message: "Cours mis à jour avec succès" });
      } else {
        res.status(404).json({ error: "Cours non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du cours : ", error);
      res.status(500).json({ error: "Erreur serveur lors de la mise à jour du cours" });
    }
  });

  
// Route pour mettre à jour un cours
router.put('/MAJ_ET/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { jour, heureDebut, heureFin, emploistemps, /* autres champs si nécessaire */ } = req.body;
    

    // Vérifiez si le cours existe
    const existingCours = await Cours.findByPk(id);
    if (!existingCours) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    // Mettez à jour les champs du cours
    existingCours.jour = jour;
    existingCours.heureDebut = heureDebut;
    existingCours.heureFin = heureFin;
    existingCours.emploisTemps = emploistemps;
    // Mettez à jour d'autres champs selon vos besoins

    // Enregistrez les modifications dans la base de données
    await existingCours.save();

    return res.status(200).json({ message: 'Cours mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours : ', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du cours' });
  }
});


module.exports = router;