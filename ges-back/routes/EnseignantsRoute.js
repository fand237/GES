const express = require('express')
const router = express.Router();
const { Enseignant } = require("../models")
const { SHA256 } = require('crypto-js');
const { validateToken } = require("../middlewares/AuthMiddleware")
const { sign } = require('jsonwebtoken')




router.get("/", async (req, res) => {

  const listOfEnseignant = await Enseignant.findAll();
  res.json(listOfEnseignant);


});

router.get("/auth", validateToken,(req, res) => {
  console.log("le req user dans auth est ", req.utilisateur);

  return res.json(req.utilisateur);


});

router.get("/:id", validateToken, async (req, res) => {

  const id = req.params.id;
  const post = await Enseignant.findByPk(id);
  res.json(post);


});

router.post("/", async (req, res) => {

  const post = req.body;
  const isOverlap = await Enseignant.checkOverlapEmail(post.email);
  const isOverlapUser = await Enseignant.checkOverlapUsername(post.nomUtilisateur);

  // Si l'unicité n'est pas respectée, renvoyer une réponse avec le statut 422
  if (isOverlapUser) {
    return res.status(422).json({ error: "Ce nom d'utilisateur est déjà utilisé." });
  } else if (isOverlap) {
    return res.status(422).json({ error: "Cette adresse e-mail est déjà utilisée." });
  }
  let ens = await Enseignant.create(post);
  ens.typeuser = "Enseignant";
  await ens.save();
  res.json(post);
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
  const enseignantId = req.params.id;
  const updatedData = req.body;

  try {
    // Utilisez la méthode update pour mettre à jour le cours avec l'ID spécifié
    const result = await Enseignant.update(updatedData, {
      where: { id: enseignantId },
    });

    // result[0] contient le nombre de lignes mises à jour
    if (result[0] > 0) {
      res.json({ message: "Enseignant mis à jour avec succès" });
    } else {
      res.status(404).json({ error: "Enseignant non trouvé" });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du Enseignant : ", error);
    res.status(500).json({ error: "Erreur serveur lors de la mise à jour de l'enseignant Enseignant" });
  }
});

router.post("/login", async (req, res) => {

  try {
    const { nomUtilisateur, motDePasse } = req.body;
    const user = await Enseignant.findOne({ where: { nomUtilisateur: nomUtilisateur } })

    if (!user) return res.json({ error: "Utilisateur inexistant" });

    if (!(user.motDePasse == SHA256(motDePasse).toString())) {
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