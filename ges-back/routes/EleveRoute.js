const express = require('express')
const router = express.Router();
const {Eleve, Classe, Parent} = require("../models")



router.get("/", async (req, res) => {

    const listOfEleve = await Eleve.findAll();
    res.json(listOfEleve);


});

router.get("/:id", async (req, res) => {

    const id=req.params.id;
    const post = await Eleve.findByPk(id);
    res.json(post);


});

router.get("/byclasse/:id", async (req, res) => {

  const classeid=req.params.id;

  try {
    // Utilisez findAll avec une condition where pour récupérer les cours du jour spécifié
    const Eleves = await Eleve.findAll({
      where: { classe: classeid },
      include: [
        { model: Classe, as: 'classeEleve' }, // Inclure les informations sur la classe
        { model: Parent, as: 'parentEleve' }, // Inclure les informations sur le parent
      ],
      order: [['nom', 'ASC']], // Tri par ordre alphabétique du nom

    });

    res.json(Eleves);
  } catch (error) {
    console.error("Erreur lors de la récupération des elves par classe : ", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des eleves par classe" });
  }


});

router.get('/nopass/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Eleve.findByPk(id, {
      attributes: {
        exclude: ['motDePasse'], // Exclure le champ du mot de passe
      },
    });

    if (!parent) {
      return res.status(404).json({ error: 'Eleve non trouvé' });
    }

    res.json(parent);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du Eleve : ', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// Route pour la mise à jour d'un Eleve
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nomUtilisateur, motDePasse, email, nom, prenom } = req.body;
 
    // Récupérer le Eleve existant par son ID
    const eleve = await Eleve.findByPk(id);

    if (!eleve) {
      return res.status(404).json({ error: 'Eleve non trouvé' });
    }

    // Mettre à jour les champs fournis dans la requête
    eleve.nomUtilisateur = nomUtilisateur || eleve.nomUtilisateur;
    eleve.email = email || eleve.email;
    eleve.nom = nom || eleve.nom;
    eleve.prenom = prenom || eleve.prenom;

    // Mettre à jour le mot de passe uniquement s'il est fourni dans la requête
    if (motDePasse) {
      eleve.motDePasse = SHA256(motDePasse).toString();
    }

    // Sauvegarder les modifications
    await eleve.save();

    res.json({ message: 'Mise à jour réussie' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du Eleve : ', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Utilisez la méthode destroy pour supprimer l'Eleve par son ID
    await Eleve.destroy({ where: { id } });
    res.status(204).end(); // 204 No Content pour indiquer une suppression réussie
  } catch (error) {
    console.error("Erreur lors de la suppression du Enseignant : ", error);
    res.status(500).json({ error: "Erreur lors de la suppression du Enseignant" });
  }
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
          // Si tout va bien, renvoyer une réponse de succès
        return res.status(200).json({ success: 'Eleve créé avec succès' });
    
       }catch(error){
        console.error(error);
        return res.status(500).json({ error: 'Erreur serveur' });
       }
});



module.exports = router;