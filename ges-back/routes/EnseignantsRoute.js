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



module.exports = router;