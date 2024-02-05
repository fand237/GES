const express = require('express')
const router = express.Router();
const {Moyenne} = require("../models")



router.get("/", async (req, res) => {

    const listOfMoyenne = await Moyenne.findAll();
    res.json(listOfMoyenne);


});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer le Moyenne par son ID
      await Moyenne.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression du Moyenne : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression du Moyenne" });
    }
  });

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Moyenne.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    const post=req.body;
    await Moyenne.create(post);
    res.json(post);
});



module.exports = router;