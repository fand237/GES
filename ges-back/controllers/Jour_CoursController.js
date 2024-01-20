// controllers/Jour_CoursController.js
const { Jour_Cours } = require('../models');
const { Cours } = require('../models');


const createJour_Cours = async (req, res) => {
  try {
    const { coursId, jourId, heureDebut, heureFin, enseignantId, emplois_TempsId } = req.body;

    // Vérification de chevauchement
    const isOverlap = await Jour_Cours.checkOverlap(jourId, heureDebut, heureFin, enseignantId);

    if (isOverlap) {
      return res.status(400).json({ error: 'Chevauchement détecté. Veuillez choisir un autre emplacement.' });
    }

    // Création de la nouvelle instance Jour_Cours
    const jourCours = await Jour_Cours.create({
      cours: coursId,
      jour: jourId,
      heureDebut: heureDebut,
      heureFin: heureFin,
      emploisTemps:emplois_TempsId,
      // ... autres attributs
    });

    return res.status(201).json(jourCours);
  } catch (error) {
    console.error('Erreur lors de la création de Jour_Cours :', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la création de Jour_Cours.' });
  }
};

const deleteJour_Cours = async (req, res) => {
  const Jour_CoursId = req.params.id;

  try {
    // Assurez-vous d'ajouter la logique nécessaire pour supprimer le Jour_Cours de la base de données
    // Par exemple :
    await Jour_Cours.destroy({
      where: {
        id: Jour_CoursId,
      },
    });

    res.json({ success: true, message: 'Jour_Cours supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de Jour_Cours : ', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de Jour_Cours.' });
  }
};

const deleteCours = async (req, res) => {
  const coursId = req.params.id;

  try {
    // Supprimer le cours, déclenchera la suppression en cascade des enregistrements associés dans Jour_Cours
    await Cours.destroy({
      where: {
        id: coursId,
      },
    });

    res.json({ success: true, message: 'Cours et enregistrements associés dans Jour_Cours supprimés avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours et des enregistrements associés : ', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du cours et des enregistrements associés.' });
  }
};


module.exports = { createJour_Cours,
                  deleteJour_Cours,
                  deleteCours,                

};
