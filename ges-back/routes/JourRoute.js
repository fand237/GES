const express = require('express')
const router = express.Router();
const {Jour} = require("../models")



router.get("/", async (req, res) => {

    const listOfJour = await Jour.findAll();
    res.json(listOfJour);


});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer le jour par son ID
      await Jour.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression du jour : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression du jour" });
    }
  });

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Jour.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    const post=req.body;
    await Jour.create(post);
    res.json(post);
});



module.exports = router;