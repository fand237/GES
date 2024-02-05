// models/Moyenne.js

 

module.exports = (sequelize,DataTypes) => {
    const Moyenne = sequelize.define("Moyenne",{
      eleve: {
        type: DataTypes.INTEGER,
        allowNull: true,
        
      },
      note: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      moyenne: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      
      
    });
  
  
  
    Moyenne.associate = (models) => {
       
      // Association avec le modèle Sequence (Many-to-One)
      Moyenne.belongsTo(models.Eleve, {
        foreignKey: 'eleve',
        as: 'eleveMoyenne',
        onUpdate: 'CASCADE', // Active la mise à jour en cascade
        onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève
  
  
      });

      // Association avec le modèle Sequence (Many-to-One)
      Moyenne.belongsTo(models.Note, {
        foreignKey: 'note',
        as: 'noteMoyenne',
        onUpdate: 'CASCADE', // Active la mise à jour en cascade
        onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève
  
  
      });

      


    };

    // models/Moyenne.js

Moyenne.calculateAndSetMoyenne = async function (coursId) {
    try {
      // Recherche des instances de Moyenne liées au cours spécifié
      const moyennes = await Moyenne.findAll({
        include: [
          {
            model: models.Note,
            as: 'noteMoyenne',
            where: {
              cours: coursId,
            },
          },
        ],
      });
  
      // Si aucune moyenne n'est associée à ce cours, sortir
      if (moyennes.length === 0) {
        console.log('Aucune moyenne associée à ce cours.');
        return;
      }
  
      // Calcul de la moyenne pour chaque instance trouvée
      moyennes.forEach(async (moyenne) => {
        const notes = await models.Note.findAll({
          where: {
            cours: coursId,
            eleve: moyenne.eleve, // Assurez-vous de filtrer par élève
          },
        });
  
        // Si aucune note n'est associée à ce cours pour cet élève, sortir
        if (notes.length === 0) {
          console.log('Aucune note associée à ce cours pour cet élève.');
          return;
        }
  
        // Calcul de la moyenne selon la formule spécifiée
        const controleContinueNote = notes.find((note) => note.TypeNote.type === 'controle continue');
        const evaluationHarmoniseeNote = notes.find((note) => note.TypeNote.type === 'evaluation harmonisee');
  
        if (!controleContinueNote || !evaluationHarmoniseeNote) {
          console.log('Notes de contrôle continu ou d\'évaluation harmonisée manquantes.');
          return;
        }
  
        const moyenneValue = 0.3 * controleContinueNote.note + 0.7 * evaluationHarmoniseeNote.note;
  
        // Mise à jour de la moyenne dans l'instance Moyenne
        await moyenne.update({
          moyenne: moyenneValue,
        });
      });
  
      console.log('Moyennes mises à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des moyennes :', error);
      throw error;
    }
  };

  
  
  
  
    return Moyenne;
  };