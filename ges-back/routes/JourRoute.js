const express = require('express')
const router = express.Router();
const {Jour} = require("../models")
const {validateToken} = require("../middlewares/AuthMiddleware")




router.get("/",validateToken, async (req, res) => {

    const listOfJour = await Jour.findAll();
    res.json(listOfJour);


});

router.delete("/:id",validateToken, async (req, res) => {
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

router.get("/:id",validateToken, async (req, res) => {

    const id=req.params.id;
    const post = await Jour.findByPk(id);
    res.json(post);


});

router.post("/", validateToken,async(req, res) => {

    const post=req.body;

    const isOverlap = await Jour.checkOverlapJour(post.jour);

    if (isOverlap) {
      return res.status(422).json({ error: "Ce jour est déjà utilisée." });
    }

    await Jour.create(post);
    res.json(post);
});



module.exports = router;