const express = require('express')
const router = express.Router();
const {Parent} = require("../models")
const { getParentsByClasse } = require('../controllers/ParentControllers');
const { validateToken } = require("../middlewares/AuthMiddleware")




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


router.post("/", async(req, res) => {
   try{
    const post=req.body;


    const isOverlap = await Parent.checkOverlapEmail( post.email);
    const isOverlapUser = await Parent.checkOverlapUsername( post.nomUtilisateur);
    const isOverlapnumero = await Parent.checkOverlapnumero( post.indicatif, post.numeroTelephone);


    // Si l'unicité n'est pas respectée, renvoyer une réponse avec le statut 422
    if (isOverlapUser) {
        return res.status(422).json({ error: "Ce nom d'utilisateur est déjà utilisé." });
      } else if (isOverlap) {
        return res.status(422).json({ error: "Cette adresse e-mail est déjà utilisée." });
      }else if (isOverlapnumero) {
        return res.status(422).json({ error: "Ce numero est déjà utilisée." });
      }

    await Parent.create(post);
  
      // Si tout va bien, renvoyer une réponse de succès
      return res.status(200).json({ success: 'Parent créé avec succès' });

   }catch(error){
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
   }
});



module.exports = router;