// controllers/administrateurController.js
const Administrateur = require('../models/Administrateur');

// Méthode pour récupérer tous les administrateurs
async function getAllAdministrateurs(req, res) {
  try {
    const administrateurs = await Administrateur.findAll();
    res.json(administrateurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Méthode pour créer un nouvel administrateur
async function createAdministrateur(req, res) {
  const { nomUtilisateur, motDePasse, email, nom, prenom } = req.body;

  try {
    const newAdministrateur = await Administrateur.create({
      nomUtilisateur,
      motDePasse,
      email,
      nom,
      prenom,
    });

    res.status(201).json(newAdministrateur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Méthode pour désactiver un compte administrateur
async function disableAdministrateur(req, res) {
  const administrateurId = req.params.id;

  try {
    const administrateur = await Administrateur.findByPk(administrateurId);

    if (!administrateur) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    administrateur.disabled = true;
    await administrateur.save();

    res.json({ message: 'Compte administrateur désactivé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Méthode pour mettre à jour les informations d'un administrateur
async function updateAdministrateur(req, res) {
  const administrateurId = req.params.id;
  const { nomUtilisateur, motDePasse, email, nom, prenom } = req.body;

  try {
    const administrateur = await Administrateur.findByPk(administrateurId);

    if (!administrateur) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    administrateur.nomUtilisateur = nomUtilisateur;
    administrateur.motDePasse = motDePasse;
    administrateur.email = email;
    administrateur.nom = nom;
    administrateur.prenom = prenom;

    await administrateur.save();

    res.json({ message: 'Informations administrateur mises à jour avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Méthode pour supprimer un administrateur
async function deleteAdministrateur(req, res) {
  const administrateurId = req.params.id;

  try {
    const administrateur = await Administrateur.findByPk(administrateurId);

    if (!administrateur) {
      return res.status(404).json({ message: 'Administrateur non trouvé' });
    }

    await administrateur.destroy();

    res.json({ message: 'Administrateur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// Méthode pour mettre à jour les informations de l'établissement
async function updateEtablissementInfo(req, res) {
  const { nomEtablissement, adresse, telephone, email } = req.body;

  // Implémentez la logique pour mettre à jour les informations de l'établissement
  // ...

  res.json({ message: 'Informations de l\'établissement mises à jour avec succès' });
}

module.exports = {
  getAllAdministrateurs,
  createAdministrateur,
  disableAdministrateur,
  updateAdministrateur,
  deleteAdministrateur,
  updateEtablissementInfo,
};