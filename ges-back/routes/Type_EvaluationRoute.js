const express = require('express')
const router = express.Router();
const {Type_Evaluation} = require("../models")



router.get("/", async (req, res) => {

    const listOfType_Evaluation = await Type_Evaluation.findAll();
    res.json(listOfType_Evaluation);


});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer la Type_Evaluation par son ID
      await Type_Evaluation.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression de la Type_Evaluation : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression de la Type_Evaluation" });
    }
  });

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Type_Evaluation.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {
 
    const post=req.body;
    await Type_Evaluation.create(post);
    res.json(post);
});



module.exports = router;