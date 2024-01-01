const express = require('express')
const router = express.Router();

router.get("/", (req, res) => {

    res.json("Bonjour les Administrateurs, on a beaucoup à faire");

});



module.exports = router;