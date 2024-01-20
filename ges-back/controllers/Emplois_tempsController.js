const {Emplois} = require('../models');

const getOrCreateByClasse = async (req, res) => {
    try {
      const classeId = req.params.classeId;
      const emploiDuTemps = await Emplois.findByClasse(classeId);
      res.json(emploiDuTemps);
    } catch (error) {
      console.error('Erreur lors de la récupération ou de la création de l\'emploi du temps : ', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
  
  module.exports = {
    getOrCreateByClasse,
    // ... Autres méthodes ...
  }; 