// controllers/Jour_CoursController.js
const { Cours } = require('../models');

const deleteCours = async (req, res) => {
  const coursId = req.params.id;

  try {
    // Supprimer le cours, déclenchera la suppression en cascade des enregistrements associés dans Jour_Cours
    await Cours.destroy({
      where: {
        id: coursId,
      },
    });

    res.json({ success: true, message: 'Cours et enregistrements associés dans Jour_Cours supprimés avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours et des enregistrements associés : ', error);
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du cours et des enregistrements associés.' });
  }
};

const getUniqueMatieres = async (req, res) => {
  try {
    const matieres = await Cours.findAll({
      attributes: [
        [Cours.sequelize.fn('DISTINCT', Cours.sequelize.col('matiere')), 'matiere']
      ],
    });
    const uniqueMatieres = matieres.map(matiere => matiere.matiere);
    res.status(200).json(uniqueMatieres);
  } catch (error) {
    console.error('Erreur lors de la récupération des matières uniques :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des matières uniques.' });
  }
};


module.exports = { deleteCours,getUniqueMatieres, };
