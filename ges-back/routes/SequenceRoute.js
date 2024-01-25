const express = require('express')
const router = express.Router();
const {Sequence} = require("../models")



router.get("/", async (req, res) => {

    const listOfSequence = await Sequence.findAll();
     res.json(listOfSequence);

});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      // Utilisez la méthode destroy pour supprimer la Sequence par son ID
      await Sequence.destroy({ where: { id } });
      res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
    } catch (error) {
      console.error("Erreur lors de la suppression de la Sequence : ", error);
      res.status(500).json({ error: "Erreur lors de la suppression de la Sequence" });
    }
  });

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Sequence.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    const post=req.body;
    await Sequence.create(post);
    res.json(post);
});



module.exports = router;