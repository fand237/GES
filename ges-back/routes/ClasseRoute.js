const express = require('express');
const router = express.Router();
const { Classe , Cycle , Enseignant , Eleve} = require('../models');
const {validateToken} = require("../middlewares/AuthMiddleware")
const sequelize = require('sequelize'); 



// Route pour obtenir tous les classes
router.get('/', validateToken,async (req, res) => {

  try { 
    const classes = await Classe.findAll({ 
      attributes: ['id', 'classe','capacite',
        [sequelize.literal('(SELECT COUNT(*) FROM Eleves WHERE Eleves.classe = Classe.id)'), 'nombreEleves'],
      ], // Attributs de la table Classe à afficher
      include: [{
        model: Cycle,
        as: 'CycleClasse', // Utilisez l'alias défini dans votre association
        attributes: ['cycle'], // Attributs du modèle Cycle à afficher
      },
     {
        model: Enseignant,
        as: 'ResponsableClasse',
        attributes: ['nom','prenom'], // Changez 'nom' par le champ correspondant
      },
     {
        model: Eleve,
        as: 'eleves',
        attributes: [], // Nous ne voulons pas afficher d'informations sur les élèves ici
        required: false // Permet d'inclure les classes même si elles n'ont pas d'élèves

      }, ] ,
      group: ['Classe.id', 'ResponsableClasse.id'], // Group by the class id and responsible id
    }); 
// Formatez les données pour le frontend
const formattedClasses = classes.map(cls => ({
  id: cls.id,
  classe: cls.classe,
  capacite: cls.capacite,
  cycle: cls.CycleClasse ? cls.CycleClasse.cycle : 'nom defini',
  nom: cls.ResponsableClasse ? cls.ResponsableClasse.nom : 'N/A',
  prenom: cls.ResponsableClasse ? cls.ResponsableClasse.prenom : 'N/A',
  nombreEleves: cls.dataValues.nombreEleves,


}));

res.json(formattedClasses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des classes' });
  }
});

// Route pour obtenir un classe par son ID
router.get('/:id', validateToken,async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (classe) {
      res.json(classe);
    } else {
      res.status(404).json({ error: 'Classe non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du classe' });
  }
});

// Route pour créer un nouveau classe
router.post('/', validateToken,async (req, res) => {
    const post = req.body;

    const isOverlap = await Classe.checkOverlapClasse(post.classe);

    if (isOverlap) {
        return res.status(422).json({ error: "Cette Classe est déjà utilisée." });
      }
  try {
    const { classe, capacite, cycle, responsable } = req.body;
    const newClasse = await Classe.create({ 
        classe,
        capacite,
        cycle,
        responsable });
    res.status(201).json(newClasse);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du classe' });
  }
});

// Route pour mettre à jour un classe
router.put('/:id', validateToken,async (req, res) => {
  try {
    const { classe, capacite, cycle ,responsable} = req.body;
    const [updated] = await Classe.update({ 
        classe,
        capacite,
        cycle,
        responsable,
     }, { where: { id: req.params.id } });
    if (updated) {
      const updatedClasse = await Classe.findByPk(req.params.id);
      res.json(updatedClasse);
    } else {
      res.status(404).json({ error: 'Classe non trouvé' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du classe' });
  }
});

// Route pour supprimer un classe
router.delete('/:id',validateToken, async (req, res) => {
  try {
    const deleted = await Classe.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Classe non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du classe' });
  }
});

module.exports = router;
