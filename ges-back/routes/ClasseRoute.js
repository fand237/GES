const express = require('express')
const router = express.Router();
const {Classe} = require("../models")



router.get("/", async (req, res) => {

    const listOfClasse = await Classe.findAll();
    res.json(listOfClasse);


});

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Classe.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    const post=req.body;
    await Classe.create(post);
    res.json(post);
});



module.exports = router;