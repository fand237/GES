const express = require('express');
const router = express.Router();
const { Cycle , Classe } = require('../models');
const {validateToken} = require("../middlewares/AuthMiddleware")
const sequelize = require('sequelize'); // Importez Sequelize



// Route pour obtenir tous les cycles
router.get('/', validateToken, async (req, res) => {
  try {
    const cycles = await Cycle.findAll({
      attributes: [
        'id',
        'cycle',
        [sequelize.fn('COUNT', sequelize.col('CycleClasse.id')), 'numberOfClasses'] // Utilisez l'alias 'CycleClasse'
      ],
      include: {
        model: Classe,
        as: 'CycleClasse', // Spécifiez l'alias ici
        attributes: []
      },
      group: ['Cycle.id'],
    });

    res.json(cycles);
  } catch (error) {
    console.error('Erreur lors du chargement des cycles:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des cycles' });
  }
});

// Route pour obtenir un cycle par son ID
router.get('/:id', validateToken,async (req, res) => {
  try {
    const cycle = await Cycle.findByPk(req.params.id);
    if (cycle) {
      res.json(cycle);
    } else {
      res.status(404).json({ error: 'Cycle non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du cycle' });
  }
});

// Route pour créer un nouveau cycle
router.post('/', validateToken,async (req, res) => {
  try {
    const { cycle } = req.body;
    const newCycle = await Cycle.create({ cycle });
    res.status(201).json(newCycle);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du cycle' });
  }
});

// Route pour mettre à jour un cycle
router.put('/:id', validateToken,async (req, res) => {
  try {
    const { cycle } = req.body;
    const [updated] = await Cycle.update({ cycle }, { where: { id: req.params.id } });
    if (updated) {
      const updatedCycle = await Cycle.findByPk(req.params.id);
      res.json(updatedCycle);
    } else {
      res.status(404).json({ error: 'Cycle non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du cycle' });
  }
});

// Route pour supprimer un cycle
router.delete('/:id',validateToken, async (req, res) => {
  try {
    const deleted = await Cycle.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Cycle non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du cycle' });
  }
});

module.exports = router;
