const express = require('express')
const router = express.Router();
const {Eleve} = require("../models")



router.get("/", async (req, res) => {

    const listOfEleve = await Eleve.findAll();
    res.json(listOfEleve);


});

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Eleve.findByPk(id);
    res.json(post);


});

router.post("/", async(req, res) => {

    try{
        const post=req.body;
    
        const isOverlap = await Eleve.checkOverlapEmail( post.email);
        const isOverlapUser = await Eleve.checkOverlapUsername( post.nomUtilisateur);
    
        // Si l'unicité n'est pas respectée, renvoyer une réponse avec le statut 422
        if (isOverlapUser) {
            return res.status(422).json({ error: "Ce nom d'utilisateur est déjà utilisé." });
          } else if (isOverlap) {
            return res.status(422).json({ error: "Cette adresse e-mail est déjà utilisée." });
          }
    
        await Eleve.create(post);
        res.json(post);
          // Si tout va bien, renvoyer une réponse de succès
        return res.status(200).json({ success: 'Eleve créé avec succès' });
    
       }catch(error){
        console.error(error);
        return res.status(500).json({ error: 'Erreur serveur' });
       }
});



module.exports = router;