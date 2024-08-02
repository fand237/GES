const { Parent, Eleve } = require('../models');

// Fonction pour récupérer les parents par classe
const getParentsByClasse = async (req, res) => {
  const { classe } = req.params;
  try {
    const eleves = await Eleve.findAll({
      where: {
        classe: classe
      },
      include: [{
        model: Parent,
        as: 'parentEleve'
      }]
    });
    console.log("les eleves sont:",eleves);
    const parents = eleves.flatMap(eleve => eleve.parentEleve);
    console.log("les parents sont:",parents);
    res.json(parents);
  } catch (error) {
    console.error("Erreur lors de la récupération des parents par classe : ", error);
    res.status(500).json({ error: "Erreur lors de la récupération des parents par classe" });
  }
};

// Exporter la fonction du contrôleur
module.exports = {
  getParentsByClasse,
};
