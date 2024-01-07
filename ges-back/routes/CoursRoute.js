const express = require('express')
const router = express.Router();
const {Cours} = require("../models")



router.get("/", async (req, res) => {

    const listOfCours = await Cours.findAll();
    res.json(listOfCours);

});

router.post("/", async(req, res) => {

    const post=req.body;
    await Cours.create(post);
    res.json(post);
});



module.exports = router;