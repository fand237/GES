// controllers/enseignantController.js

// Importer les modèles nécessaires
const { Enseignant, Cours } = require('../models');

// Fonction pour récupérer les enseignants par matière
const getEnseignantsByMatiere = async (req, res) => {
  // Extraire la matière des paramètres de la requête
  const { matiere } = req.params;

  try {
    // Rechercher tous les cours qui correspondent à la matière donnée
    const enseignants = await Cours.findAll({
      where: { matiere: matiere },
      include: [
        {
          model: Enseignant,
          as: 'enseignant',
        },
      ],
    });

    const result = enseignants.map(cours => cours.enseignant);
    console.log("les resultats du by matiere:",result);
    res.json(result);  } catch (error) {
    // En cas d'erreur, afficher un message d'erreur et renvoyer une réponse 500
    console.error('Erreur lors de la récupération des enseignants par matière :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des enseignants par matière' });
  }
};

// Fonction pour récupérer les enseignants par classe
const getEnseignantsByClasse = async (req, res) => {
  const { classe } = req.params;
  try {
    const enseignants = await Cours.findAll({
      where: {
        classe: classe
      },
      include: [{
        model: Enseignant,
        as: 'enseignant'
      }]
    });
    const result = enseignants.map(cours => cours.enseignant);
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des enseignants par classe : ", error);
    res.status(500).json({ error: "Erreur lors de la récupération des enseignants par classe" });
  }
};

// Fonction pour récupérer les enseignants par classe et matiere
const getEnseignantsByClasseMatiere = async (req, res) => {
  const { matiere, classe } = req.query;
  try {
    const enseignants = await Cours.findAll({
      where: {
        matiere: matiere,
        classe: classe
      },
      include: [{
        model: Enseignant,
        as: 'enseignant'
      }]
    });
    const result = enseignants.map(cours => cours.enseignant);
    res.json(result);
  } catch (error) {
    console.error("Erreur lors de la récupération des enseignants par matière et classe : ", error);
    res.status(500).json({ error: "Erreur lors de la récupération des enseignants par matière et classe" });
  }
};

// Exporter la fonction du contrôleur
module.exports = {
  getEnseignantsByMatiere,getEnseignantsByClasse,getEnseignantsByClasseMatiere,
};
