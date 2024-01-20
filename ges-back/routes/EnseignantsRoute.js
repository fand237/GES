const express = require('express')
const router = express.Router();
const {Enseignant} = require("../models")



router.get("/", async (req, res) => {

    const listOfEnseignant = await Enseignant.findAll();
    res.json(listOfEnseignant);


});

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Enseignant.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    const post=req.body;
    await Enseignant.create(post);
    res.json(post);
});

// Ajoutez une nouvelle route pour supprimer un Enseignant par ID
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer le Enseignant par son ID
      await Enseignant.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression du Enseignant : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression du Enseignant" });
    }
  });

  // Route pour la mise à jour d'un Parent
router.put("/:id", async (req, res) => {
  const enseignantId = req.params.id;
  const updatedData = req.body;

  try {
    // Utilisez la méthode update pour mettre à jour le cours avec l'ID spécifié
    const result = await Enseignant.update(updatedData, {
      where: { id: enseignantId },
    });

    // result[0] contient le nombre de lignes mises à jour
    if (result[0] > 0) {
      res.json({ message: "Enseignant mis à jour avec succès" });
    } else {
      res.status(404).json({ error: "Enseignant non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du Enseignant : ", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'enseignant Enseignant" });
  }
});



module.exports = router;