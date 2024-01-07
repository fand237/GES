const express = require('express')
const router = express.Router();
const {Administrateur} = require("../models")



router.get("/", async (req, res) => {

    const listOfAdministrateur = await Administrateur.findAll();
    res.json(listOfAdministrateur);

});

router.post("/", async(req, res) => {

    const post=req.body;
    await Administrateur.create(post);
    res.json(post);
});



module.exports = router;