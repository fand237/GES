const express = require('express')
const router = express.Router();
const {Administrateur} = require("../models")
const { SHA256 } = require('crypto-js');
const { validateToken } = require("../middlewares/AuthMiddleware")
const { sign } = require('jsonwebtoken')


router.get("/", async (req, res) => {

    const listOfAdministrateur = await Administrateur.findAll();
    res.json(listOfAdministrateur);

});

router.post("/", async(req, res) => {

    const post = req.body;
    const isOverlap = await Administrateur.checkOverlapEmail(post.email);
    const isOverlapUser = await Administrateur.checkOverlapUsername(post.nomUtilisateur);
  
    // Si l'unicité n'est pas respectée, renvoyer une réponse avec le statut 422
    if (isOverlapUser) {
      return res.status(422).json({ error: "Ce nom d'utilisateur est déjà utilisé." });
    } else if (isOverlap) {
      return res.status(422).json({ error: "Cette adresse e-mail est déjà utilisée." });
    }
    let ad = await Administrateur.create(post);
    ad.typeuser = "Administrateur";
    await ad.save();
    res.json(post);
});

router.post("/login", async (req, res) => {

    try {
      const { nomUtilisateur, motDePasse } = req.body;
      const user = await Administrateur.findOne({ where: { nomUtilisateur: nomUtilisateur } })
  
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