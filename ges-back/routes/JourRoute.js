const express = require('express')
const router = express.Router();
const {Jour} = require("../models")



router.get("/", async (req, res) => {

    const listOfJour = await Jour.findAll();
    res.json(listOfJour);


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