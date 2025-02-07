const express = require('express')
const router = express.Router();
const {Groupe} = require("../models")
const {validateToken} = require("../middlewares/AuthMiddleware")




router.get("/", async (req, res) => {

    const listOfGroupe = await Groupe.findAll();
    res.json(listOfGroupe);


});

router.delete("/:id", validateToken,async (req, res) => {
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

router.get("/:id",validateToken ,async (req, res) => {

    const id=req.params.id;
    const post = await Groupe.findByPk(id);
    res.json(post);


});

router.post("/", validateToken,async(req, res) => {
  const post=req.body;

  const isOverlap = await Groupe.checkOverlapGroupe(post.groupe);

  if (isOverlap) {
    return res.status(422).json({ error: "Ce Groupe est déjà utilisée." });
  }


    await Groupe.create(post);
    res.json(post);
});



module.exports = router;