const express = require('express')
const router = express.Router();
const {Parent} = require("../models")
const { getParentsByClasse } = require('../controllers/ParentControllers');
const { validateToken } = require("../middlewares/AuthMiddleware")
const bcrypt = require('bcrypt');




router.get('/byClasse/:classe',validateToken,getParentsByClasse);

router.get("/", async (req, res) => {

    const listOfParent = await Parent.findAll({
      order: [['nom', 'ASC']], // Tri par ordre alphabétique du nom

    });
    res.json(listOfParent);


});

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Parent.findByPk(id);
    res.json(post);


});

// Supposons que vous ayez une route pour récupérer les informations d'un parent par ID
router.get('/nopass/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findByPk(id, {
      attributes: {
        exclude: ['motDePasse'], // Exclure le champ du mot de passe
      },
    });

    if (!parent) {
      return res.status(404).json({ error: 'Parent non trouvé' });
    }

    res.json(parent);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du parent : ', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Utilisez la méthode destroy pour supprimer le Enseignant par son ID
    await Parent.destroy({ where: { id } });
    res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
  } catch (error) {
    console.error("Erreur lors de la suppression du Enseignant : ", error);
    res.status(500).json({ error: "Erreur lors de la suppression du Enseignant" });
  }
});

// Route pour la mise à jour d'un Parent
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nomUtilisateur, motDePasse, email, nom, prenom } = req.body;
 
    // Récupérer le parent existant par son ID
    const parent = await Parent.findByPk(id);

    if (!parent) {
      return res.status(404).json({ error: 'Parent non trouvé' });
    }

    // Mettre à jour les champs fournis dans la requête
    parent.nomUtilisateur = nomUtilisateur || parent.nomUtilisateur;
    parent.email = email || parent.email;
    parent.nom = nom || parent.nom;
    parent.prenom = prenom || parent.prenom;

    // Mettre à jour le mot de passe uniquement s'il est fourni dans la requête
    if (motDePasse) {
      parent.motDePasse = SHA256(motDePasse).toString();
    }

    // Sauvegarder les modifications
    await parent.save();

    res.json({ message: 'Mise à jour réussie' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du parent : ', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Fonction pour générer le nom d'utilisateur
const generateUsername = (nom, prenom, numeroTelephone) => {
  const username = `${nom.slice(0, 2)}${prenom.slice(0, 2)}${numeroTelephone}`;
  return username;
};

// routes/parent.js
router.post("/", validateToken,async (req, res) => {
  const post = req.body;
  const { email, nom, prenom, indicatif, numeroTelephone, profession, quartier, civilite, situationMatriomiale } = req.body;
  
  try {
    const isOverlap = await Parent.checkOverlapEmail(email);
    //const isOverlapUser = await Parent.checkOverlapUsername(nomUtilisateur);
    const isOverlapnumero = await Parent.checkOverlapnumero(indicatif, numeroTelephone);

    if (isOverlap) {
      return res.status(422).json({ error: "Cette adresse e-mail est déjà utilisée." });
    } else if (isOverlapnumero) {
      return res.status(422).json({ error: "Ce numéro est déjà utilisé." });
    }

     // Génération des données
    const year = new Date().getFullYear().toString().slice(-2);
    const type = "PAR";
       
    
        // Générer le numéro incrémental
        const lastUser = await Parent.findOne({
          order: [['createdAt', 'DESC']],
          attributes: ['numeroIncremental'],
        });
        const incrementNumber = lastUser ? lastUser.numeroIncremental+ 1 : 1;
    
        // Créer le nom d'utilisateur
        const nomUtilisateur = `${year}${type}${incrementNumber}`; 
     const motDePasse = 'qwerty237'; // Mot de passe par défaut

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const newParent = await Parent.create({
      nomUtilisateur,
      motDePasse: hashedPassword,
      email, 
      nom,
      prenom,
      indicatif,
      numeroTelephone,
      profession,
      quartier,
      civilite,
      situationMatriomiale,
    });

    res.status(201).json({ nomUtilisateur });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});





module.exports = router;