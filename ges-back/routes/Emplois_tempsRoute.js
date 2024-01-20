const express = require('express');
const router = express.Router();
const emploisController = require('../controllers/Emplois_tempsController');

// ... Autres imports ...

router.get('/byclasse/:classeId', emploisController.getOrCreateByClasse);
// ... Autres routes ...

module.exports = router;