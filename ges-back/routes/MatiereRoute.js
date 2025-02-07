const express = require('express');
const router = express.Router();
const { Matiere } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Récupérer toutes les matières
router.get("/", validateToken,async (req, res) => {
  try {
    const listOfMatieres = await Matiere.findAll();
    res.json(listOfMatieres);
  } catch (error) {
    console.error("Erreur lors de la récupération des matières : ", error);
    res.status(500).json({ error: "Erreur lors de la récupération des matières" });
  }
});

// Supprimer une matière par son ID
router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  try {
    await Matiere.destroy({ where: { id } });
    res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
  } catch (error) {
    console.error("Erreur lors de la suppression de la matière : ", error);
    res.status(500).json({ error: "Erreur lors de la suppression de la matière" });
  }
});

// Récupérer une matière par son ID
router.get("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const matiere = await Matiere.findByPk(id);
    if (matiere) {
      res.json(matiere);
    } else {
      res.status(404).json({ error: "Matière non trouvée" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la matière : ", error);
    res.status(500).json({ error: "Erreur lors de la récupération de la matière" });
  }
});

// Ajouter une nouvelle matière
router.post("/", validateToken, async (req, res) => {
  const { nom } = req.body;

  try {
    // Vérifier si la matière existe déjà
    const isOverlap = await Matiere.checkOverlapMatiere(nom);
    if (isOverlap) {
      return res.status(422).json({ error: "Cette matière existe déjà." });
    }

    // Créer la nouvelle matière
    const newMatiere = await Matiere.create({ nom });
    res.status(201).json(newMatiere); // 201 Created pour indiquer une création réussie
  } catch (error) {
    console.error("Erreur lors de la création de la matière : ", error);
    res.status(500).json({ error: "Erreur lors de la création de la matière" });
  }
});

module.exports = router;