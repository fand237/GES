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



module.exports = router;