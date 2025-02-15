const express = require('express')
const router = express.Router();
const {Annee_Academique, Groupe} = require("../models")



router.get("/", async (req, res) => {

    const listOfAnnee_Academique = await Annee_Academique.findAll();
    res.json(listOfAnnee_Academique);


});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer le Annee_Academique par son ID
      await Annee_Academique.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression du Annee_Academique : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression du Annee_Academique" });
    }
  });

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Annee_Academique.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    const post=req.body;


    const isOverlap = await Annee_Academique.checkOverlapAnnee_Academique(post.annee);

    if (isOverlap) {
        return res.status(422).json({ error: "Ce Annee Academique est déjà utilisée." });
    }

    await Annee_Academique.create(post);
    res.json(post);
});



module.exports = router;