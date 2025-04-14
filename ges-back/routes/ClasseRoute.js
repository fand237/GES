const express = require('express');
const router = express.Router();
const { Classe , Cycle , Enseignant , Eleve, Niveau} = require('../models');
const {validateToken} = require("../middlewares/AuthMiddleware")
const sequelize = require('sequelize'); 



// Route pour obtenir tous les classes
router.get('/', validateToken,async (req, res) => {

  try { 
    const classes = await Classe.findAll({ 
      attributes: ['id', 'classe','capacite',
        [sequelize.literal('(SELECT COUNT(*) FROM Eleves WHERE Eleves.classe = Classe.id)'), 'nombreEleves'],
      ], // Attributs de la table Classe à afficher
      include: [
          {
              model: Niveau,
              as: 'NiveauClasse',
              attributes: ['id', 'nom']
          },
          {
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
    niveau: cls.NiveauClasse ? cls.NiveauClasse.nom : 'N/A',
    niveauId: cls.NiveauClasse ? cls.NiveauClasse.id : null,
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
    const { classe, capacite, cycle, responsable,niveauId } = req.body;
      // Vérifier que le niveau existe
      const niveau = await Niveau.findByPk(niveauId);
      if (!niveau) {
          return res.status(400).json({ error: "Niveau invalide" });
      }
    const newClasse = await Classe.create({ 
        classe,
        capacite,
        cycle,
        responsable,
        niveauId});
    res.status(201).json(newClasse);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du classe' });
  }
});

// Route pour mettre à jour un classe
router.put('/:id', validateToken,async (req, res) => {
  try {
    const { classe, capacite, cycle ,responsable,niveauId} = req.body;
    const [updated] = await Classe.update({ 
        classe,
        capacite,
        cycle,
        responsable,
        niveauId
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

// Route pour récupérer les classes par niveau
router.get('/byNiveau/:niveauId', async (req, res) => {
    const niveauId = req.params.niveauId;

    try {
        const classes = await Classe.findAll({
            where: { niveauId: niveauId },
            attributes: ['id', 'classe']
        });

        res.json(classes);
    } catch (error) {
        console.error("Erreur récupération classes par niveau:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Récupérer les classes dont l'enseignant est responsable
router.get('/responsable/:enseignantId', validateToken, async (req, res) => {
    try {
        const { enseignantId } = req.params;

        // Vérifier que l'enseignant existe
        const enseignant = await Enseignant.findByPk(enseignantId);
        if (!enseignant) {
            return res.status(404).json({ error: "Enseignant non trouvé" });
        }

        // Récupérer les classes dont l'enseignant est responsable
        const classes = await Classe.findAll({
            where: {
                responsable: enseignantId
            },
            attributes: ['id', 'classe', 'cycle', 'niveauId'],
            order: [['classe', 'ASC']]
        });

        res.json(classes);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
module.exports = router;
