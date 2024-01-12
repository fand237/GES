const express = require('express')
const router = express.Router();
const {Cours} = require("../models")



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
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer le cours par son ID
      await Cours.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression du cours : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression du cours" });
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

    const post=req.body;
    await Cours.create(post);
    res.json(post);
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



module.exports = router;