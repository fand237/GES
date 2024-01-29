const express = require('express')
const router = express.Router();
const {Groupe} = require("../models")



router.get("/", async (req, res) => {

    const listOfGroupe = await Groupe.findAll();
    res.json(listOfGroupe);


});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer le Groupe par son ID
      await Groupe.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression du Groupe : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression du Groupe" });
    }
  });

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Groupe.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    const post=req.body;
    await Groupe.create(post);
    res.json(post);
});



module.exports = router;