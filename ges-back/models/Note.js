// models/Note.js


module.exports = (sequelize,DataTypes) => {
  const Note = sequelize.define("Note",{
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    note: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dateEvaluation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type_Evaluation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    
  });



  Note.associate = (models) => {
     
    // Association avec le modèle Tyepe Evaluation (Many-to-One)
    Note.belongsTo(models.Type_Evaluation, {
      foreignKey: 'type_Evaluation',
      as: 'TypeNote', 
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève

    });


    Note.hasOne(models.Moyenne, {
      foreignKey: 'cours',
      sourceKey: 'cours',

      as: 'moyenneNote',
    });


    // Association avec le modèle Sequence (Many-to-One)
    Note.belongsTo(models.Sequence, {
      foreignKey: 'sequence',
      as: 'sequenceNote',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève


    });

    // Association avec le modèle Sequence (Many-to-One)
    Note.belongsTo(models.Cours, {
      foreignKey: 'cours',
      as: 'coursNote',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève


    });

    // Association avec le modèle Sequence (Many-to-One)
    Note.belongsTo(models.Eleve, {
      foreignKey: 'eleve',
      as: 'eleveNote',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève


    });
  };

  Note.addHook('afterCreate', async (note, options) => {
    const { eleve, cours, sequence } = note;

    // Récupérer les deux notes (Contrôle Continu et Évaluation Harmonisée)
    const notes = await Note.findAll({
      where: {
        eleve,
        cours,
        sequence,
      },
      include: [
        {
          model: sequelize.models.Type_Evaluation,
          as: 'TypeNote',
        },
      ],
    });

    // Vérifier que les deux notes existent
    if (notes.length === 2) {
      const controleContinue = notes.find(n => n.TypeNote.type === 'Controle Continue').note;
      const evaluationHarmonisee = notes.find(n => n.TypeNote.type === 'Evaluation Harmonisé').note;

      // Calculer la moyenne pondérée
      const moyenne = (controleContinue * 0.3) + (evaluationHarmonisee * 0.7);

      // Récupérer l'année académique active
      const anneeAcademique = await sequelize.models.Annee_Academique.findOne({
        where: { annee: '2024-2025' },
      });

      if (!anneeAcademique) {
        throw new Error('Aucune année académique active trouvée');
      }

      let anneeId = anneeAcademique.id;
      // Créer ou mettre à jour la moyenne
      // Vérifier s'il existe déjà une moyenne pour cette combinaison
      const moyenneExists = await sequelize.models.Moyenne.checkOverlapMoyenne(eleve, cours, sequence, anneeId);

      if (moyenneExists) {
        // Mettre à jour la moyenne existante
        await sequelize.models.Moyenne.update(
            { moyenne },
            {
              where: {
                eleve,
                cours,
                sequence,
                annee: anneeId,
              },
            }
        );
      } else {
        // Créer une nouvelle moyenne
        await sequelize.models.Moyenne.create({
          eleve,
          cours,
          sequence,
          annee: anneeId,
          moyenne,
        });
      }
    }
  });

  return Note;
};  