const express = require('express')
const router = express.Router();
const {Presence} = require("../models")


// Route pour créer ou mettre à jour la présence
router.post('/updateOrCreate', async (req, res) => {
    try {
      const { eleve, cours, jour, statut } = req.body;
  
      // Recherche d'une instance existante
      const existingInstance = await Presence.findOne({
        where: {
          eleve,
          cours,
          jour,
        },
      });
  
      if (existingInstance) {
        // Si l'instance existe, mettez à jour le statut
        existingInstance.statut = statut;
        await existingInstance.save();
      } else {
        // Sinon, créez une nouvelle instance
        await Presence.create({ eleve, cours, jour, statut });
      }
  
      res.json({ message: 'Mise à jour ou création réussie' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour ou de la création de la présence : ', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  





  module.exports = router;