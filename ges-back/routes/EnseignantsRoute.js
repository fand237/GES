const express = require('express')
const router = express.Router();
const { Enseignant,Classe } = require("../models")
const bcrypt = require('bcrypt'); // bcrypt is a more secure alternative to crypto-js for hashing passwords
const { validateToken } = require("../middlewares/AuthMiddleware")
const { sign } = require('jsonwebtoken')
const { getEnseignantsByMatiere, getEnseignantsByClasse, getEnseignantsByClasseMatiere } = require('../controllers/EnseignantController');





router.get("/", validateToken, async (req, res) => {
  try {
    const listOfEnseignant = await Enseignant.findAll({
      include: [
        {
          model: Classe,
          as: "ResponsableClasse", // Nom défini dans l'association
          attributes: ["id", "classe", "capacite"], // Champs spécifiques à inclure
        },
      ],
    });

    res.json(listOfEnseignant);
  } catch (error) {
    console.error("Erreur lors de la récupération des enseignants :", error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des enseignants." });
  }
});

router.get('/bymatiere/:matiere',validateToken,getEnseignantsByMatiere);
router.get('/byClasse/:classe', validateToken,getEnseignantsByClasse);
router.get('/bymatiereEtclasse', validateToken,getEnseignantsByClasseMatiere);


router.get("/auth", validateToken,(req, res) => {
  //console.log("le req user dans auth est ", req.utilisateur);

  return res.json(req.utilisateur);

});

router.get("/:id", validateToken, async (req, res) => {

  const id = req.params.id;
  const post = await Enseignant.findByPk(id);
  res.json(post);


});

router.get('/forupdate/:id', validateToken,async (req, res) => {
  const { id } = req.params;
  try {
    const enseignant = await Enseignant.findByPk(id, { attributes: { exclude: ['motDePasse'] } });
    if (!enseignant) {
      return res.status(404).json({ error: "Enseignant non existant" });
    }
    res.json(enseignant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fonction pour générer le nom d'utilisateur
/*const generateUsername = (nom, prenom, numeroTelephone) => {
  const username = `${nom.slice(0, 2)}${prenom.slice(0, 2)}${numeroTelephone}`;
  return username;
};*/

router.post("/", validateToken,async (req, res) => {

  const post = req.body;
  console.log(req);
  const { email, nom, prenom, numeroTelephone, indicatif, typeEnseignant, civilite } = req.body;
  const isOverlap = await Enseignant.checkOverlapEmail(post.email);
  const isOverlapnumero = await Enseignant.checkOverlapnumero(indicatif, numeroTelephone);

  //const isOverlapUser = await Enseignant.checkOverlapUsername(post.nomUtilisateur);

  // Si l'unicité n'est pas respectée, renvoyer une réponse avec le statut 422
  if (isOverlap) {
    return res.status(422).json({ error: "Cette adresse e-mail est déjà utilisée." });
  }else if (isOverlapnumero) {
    return res.status(422).json({ error: "Ce numéro est déjà utilisé." });
  }
  try {
    // Génération des données
    const year = new Date().getFullYear().toString().slice(-2);
    const type = "ENS";
       
    
        // Générer le numéro incrémental
        const lastUser = await Enseignant.findOne({
          order: [['createdAt', 'DESC']],
          attributes: ['numeroIncremental'],
        });
        const incrementNumber = lastUser ? lastUser.numeroIncremental+ 1 : 1;
    
        // Créer le nom d'utilisateur
        const nomUtilisateur = `${year}${type}${incrementNumber}`;  
          const motDePasse = 'qwerty237'; // Mot de passe par défaut

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const newEnseignant = await Enseignant.create({
      nomUtilisateur,
      motDePasse: hashedPassword,
      email,
      nom,
      prenom,
      civilite,
      numeroTelephone,
      indicatif,
      typeEnseignant,
      numeroIncremental: incrementNumber,
      typeuser:"Enseignant",
    });
  

    res.status(201).json({ nomUtilisateur });
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  });

// Ajoutez une nouvelle route pour supprimer un Enseignant par ID
router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  try {
    // Utilisez la méthode destroy pour supprimer le Enseignant par son ID
    await Enseignant.destroy({ where: { id } });
    res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
  } catch (error) {
    console.error("Erreur lors de la suppression du Enseignant : ", error);
    res.status(500).json({ error: "Erreur lors de la suppression du Enseignant" });
  }
});

// Route pour la mise à jour d'un Parent
router.put("/:id", validateToken, async (req, res) => {
  const { id } = req.params;
  const { nomUtilisateur, motDePasse, email, nom, prenom , civilite, numeroTelephone, indicatif, typeEnseignant,} = req.body;

    console.log(req.body);

  try {
      const enseignant = await Enseignant.findByPk(id);
      if (!enseignant) {
          return res.status(404).json({ error: "Enseignant non trouvé" });
      }

      const updatedData = {
          nomUtilisateur,
          email,
          nom,
          prenom,
          civilite,
          numeroTelephone,
          indicatif,
          typeEnseignant, 
      };

      if (motDePasse) {
          const hashedPassword = await bcrypt.hash(motDePasse, 10);
          updatedData.motDePasse = hashedPassword;
      }

      await enseignant.update(updatedData);
      res.json({ message: "Enseignant mis à jour avec succès" });

  } catch (error) {
      console.error("Erreur lors de la mise à jour de l'enseignant :", error);
      res.status(500).json({ error: "Erreur du serveur" });
  }
});

router.post("/login", async (req, res) => {

  try {
    const { nomUtilisateur, motDePasse } = req.body;
    const user = await Enseignant.findOne({ where: { nomUtilisateur: nomUtilisateur } })

    if (!user) return res.json({ error: "Utilisateur inexistant" });
    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!(isPasswordValid)) {
      // Si tout va bien, renvoyer une réponse de succès
      return res.json({ error: "udername ou password incorrrect" });
    }

    const accessToken = sign(
      { nomUtilisateur: user.nomUtilisateur, id: user.id, typeUtilisateur: user.typeuser },
      "importantsecret"
    );


    return res.json({token: accessToken,nomUtilisateur: user.nomUtilisateur, id: user.id, typeUtilisateur: user.typeuser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});





module.exports = router;