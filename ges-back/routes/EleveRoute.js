const express = require('express')
const router = express.Router();
const { Eleve, Classe, Parent,Conversation, Cours } = require("../models")
const bcrypt = require('bcrypt');
const {validateToken} = require("../middlewares/AuthMiddleware")
const { sign } = require('jsonwebtoken')
const { Op } = require('sequelize');





router.get("/", validateToken,async (req, res) => {

  const listOfEleve = await Eleve.findAll();
  res.json(listOfEleve);


});

router.get("/auth", validateToken,(req, res) => {
  console.log("le req user dans auth est ", req.utilisateur);

  return res.json(req.utilisateur);


});

router.get("/:id", validateToken,async (req, res) => {

  const id = req.params.id;
  const post = await Eleve.findByPk(id,{
      include: [
          {model:Classe,as:'classeEleve'}
      ]
  });
  res.json(post);


});

router.get("/byclasse/:id", async (req, res) => {

  const classeid = req.params.id;

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
  const { id } = req.params;
    const { nomUtilisateur, motDePasse, email, nom, prenom, dateNaissance, classe, parent,civilite } = req.body;

    try {
        const eleve = await Eleve.findByPk(id);
        if (!eleve) {
            return res.status(404).json({ error: "Élève non trouvé" });
        }

        const updatedData = {
            nomUtilisateur,
            email,
            nom,
            prenom,
            dateNaissance,
            classe,
            parent,
            civilite,
        };

        if (motDePasse) {
            const hashedPassword = await bcrypt.hash(motDePasse, saltRounds);
            updatedData.motDePasse = hashedPassword;
        }

        await eleve.update(updatedData);
        res.json({ message: "Élève mis à jour avec succès" });

    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'élève :", error);
        res.status(500).json({ error: "Erreur du serveur" });
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

// Fonction pour générer le nom d'utilisateur
const generateUsername = (nom, prenom, numeroTelephone) => {
  const username = `${nom.slice(0, 2)}${prenom.slice(0, 2)}${numeroTelephone}`;
  return username;
};

router.post("/",validateToken,async (req, res) => {

    const post = req.body;

    const isOverlap = await Eleve.checkOverlapEmail(post.email);

    // Si l'unicité n'est pas respectée, renvoyer une réponse avec le statut 422
   if (isOverlap) {
      return res.status(422).json({ error: "Cette adresse e-mail est déjà utilisée." });
    }

    const {  email, nom, prenom, dateNaissance, classe, parent ,civilite} = req.body;
    try {
      const motDePasse = 'qwerty237'; // Mot de passe par défaut

        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Obtenir l'année en cours
    const year = new Date().getFullYear().toString().slice(-2);
const ville = "yaounde";
    // Obtenir les trois lettres de la ville
    const city = ville.toUpperCase();
    const firstLetter = city.charAt(0);
    const thirdLetter = city.charAt(2);
    const lastLetter = city.charAt(city.length - 1);

    // Générer le numéro incrémental
    const lastUser = await Eleve.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['nomUtilisateur'],
    });
    const incrementNumber = lastUser ? parseInt(lastUser.nomUtilisateur.match(/\d+$/)) + 1 : 1;

    // Créer le nom d'utilisateur
    const nomUtilisateur = `${year}${firstLetter}${thirdLetter}${lastLetter}${incrementNumber}`;

  
        const eleve = await Eleve.create({
            nomUtilisateur,
            motDePasse: hashedPassword,
            email,
            nom,
            prenom,
            dateNaissance,
            classe,
            parent,
            civilite,
            numeroIncremental: incrementNumber,
            typeuser:"Eleve",
          });
        
        res.status(201).json({nomUtilisateur});
    } catch (error) {
        console.error("Erreur lors de la création de l'élève :", error);
        res.status(500).json({ error: "Erreur du serveur" });
    }
    
  
});


router.post("/login", async (req, res) => {

  try {
    const { nomUtilisateur, motDePasse } = req.body;
    const user = await Eleve.findOne({ where: { nomUtilisateur: nomUtilisateur } })

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

// Nouvelle route pour obtenir les camarades de classe
router.get('/classmates/:eleveId', validateToken, async (req, res) => {
    try {
        // 1. Récupérer l'élève pour obtenir sa classe
        const eleve = await Eleve.findByPk(req.params.eleveId);
        if (!eleve) {
            return res.status(404).json({ error: "Élève non trouvé" });
        }

        // 2. Récupérer tous les élèves de la même classe (sauf l'élève actuel)
        const classmates = await Eleve.findAll({
            where: {
                classe: eleve.classe,
                id: { [Op.ne]: eleve.id } // Exclure l'élève actuel
            },
            attributes: ['id', 'nom', 'prenom', 'nomUtilisateur'],
            include: [{
                model: Conversation,
                as: 'conversations',
                attributes: ['id'],
                through: { attributes: [] }
            }],
            order: [['nom', 'ASC']]
        });

        // 3. Filtrer pour n'avoir que les élèves sans conversation existante
        const availableClassmates = classmates.filter(classmate =>
            classmate.conversations.length === 0
        );

        res.json(availableClassmates);
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get('/elevesParEnseignant/:enseignantId', validateToken, async (req, res) => {
    try {
        const { enseignantId } = req.params;

        // 1. D'abord trouver les classes où l'enseignant donne cours
        const classesAvecCours = await Cours.findAll({
            where: { Enseignant: enseignantId },
            attributes: ['classe'],
            group: ['classe']
        });

        if (!classesAvecCours.length) {
            return res.json([]);
        }

        const classesIds = classesAvecCours.map(c => c.classe);

        // 2. Ensuite trouver les élèves de ces classes
        const eleves = await Eleve.findAll({
            include: [{
                model: Classe,
                as: 'classeEleve',
                attributes: ['id', 'classe'],
                where: {
                    id: classesIds
                }
            }],
            attributes: ['id', 'nom', 'prenom', 'email'],
            order: [
                [{ model: Classe, as: 'classeEleve' }, 'classe', 'ASC'],
                ['nom', 'ASC'],
                ['prenom', 'ASC']
            ]
        });

        // Formater la réponse pour inclure le nom de la classe directement
        const result = eleves.map(eleve => ({
            id: eleve.id,
            nom: eleve.nom,
            prenom: eleve.prenom,
            email: eleve.email,
            classeId: eleve.classeEleve?.id,
            classeNom: eleve.classeEleve?.classe || 'Non assigné'
        }));

        res.json(result);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});
module.exports = router;