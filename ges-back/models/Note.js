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
      unique: true ,


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
    annee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
  });

  Note.checkOverlapNote = async function (eleve,cours,type,sequence,annee) {
    try {
      const overlappingNote = await this.findAll({
        where: {
          eleve: eleve,
          cours:cours,
          type:type,
          sequence:sequence,
          annee:annee

        },

      });

      return overlappingNote.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données Note : ', error);
      throw error;
    }
  };

  Note.associate = (models) => {
     
    // Association avec le modèle Tyepe Evaluation (Many-to-One)
    Note.belongsTo(models.Type_Evaluation, {
      foreignKey: 'type_Evaluation',
      as: 'TypeNote', 
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE', // Définir la clé étrangère à NULL lors de la suppression de l'élève

    });
    Note.belongsTo(models.Annee_Academique, {
      foreignKey: 'annee',
      as: 'AnneeNote',
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
    await calculmoyenne(note)
    await recalculerMoyenneParCours(note.eleve, note.cours, note.sequence);
    await recalculerMoyenneGenerale(note.eleve, note.sequence);
    await recalculerMoyennesEtRangs(note.sequence, note.annee);

  });

  Note.addHook('afterUpdate', async (note, options) => {
    await recalculerMoyenneParCours(note.eleve, note.cours, note.sequence);
    await recalculerMoyenneGenerale(note.eleve, note.sequence);
    await recalculerMoyennesEtRangs(note.sequence, note.annee);

  });

  async function calculmoyenne(note){
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
  }

  async function recalculerMoyenneGenerale(eleve, sequence) {
    const anneeAcademique = await sequelize.models.Annee_Academique.findOne({ where: { annee: '2024-2025' } });
    if (!anneeAcademique) return;

    let anneeId = anneeAcademique.id;

    const moyennes = await sequelize.models.Moyenne.findAll({ where: { eleve, sequence, annee: anneeId } });

    if (moyennes.length === 0) return;

    let totalMoyenne = 0;
    let totalCoef = 0;

    for (const moyenne of moyennes) {
      const cours = await sequelize.models.Cours.findByPk(moyenne.cours);
      if (!cours || !cours.coefficient) continue;

      totalMoyenne += moyenne.moyennePonderee;
      totalCoef += cours.coefficient;
    }

    const moyenneGenerale = totalCoef ? (totalMoyenne / totalCoef) : 0;

    const [moyenneGenRecord, created] = await sequelize.models.MoyenneGenerale.findOrCreate({
      where: { eleve, sequence, annee: anneeId },
      defaults: { moyenne: moyenneGenerale }
    });

    if (!created) {
      moyenneGenRecord.moyenne = moyenneGenerale;
      await moyenneGenRecord.save();
    }
  }

  async function recalculerMoyenneParCours(eleve, cours, sequence) {
    const notes = await Note.findAll({
      where: { eleve, cours, sequence },
      include: [{ model: sequelize.models.Type_Evaluation, as: 'TypeNote' }],
    });

    if (notes.length === 2) {
      const controleContinue = notes.find(n => n.TypeNote.type === 'Controle Continue')?.note || 0;
      const evaluationHarmonisee = notes.find(n => n.TypeNote.type === 'Evaluation Harmonisé')?.note || 0;

      const moyenne = (controleContinue * 0.3) + (evaluationHarmonisee * 0.7);
      const anneeAcademique = await sequelize.models.Annee_Academique.findOne({ where: { annee: '2024-2025' } });

      if (!anneeAcademique) return;

      let anneeId = anneeAcademique.id;

      const [moyenneRecord, created] = await sequelize.models.Moyenne.findOrCreate({
        where: { eleve, cours, sequence, annee: anneeId },
        defaults: { moyennePonderee:moyenne }
      });

      if (!created) {
        moyenneRecord.moyenne = moyenne;
        await moyenneRecord.save();
      }
    }
  }

  async function recalculerMoyennesEtRangs(sequence, annee) {
    // Récupérer les classes concernées
    const classes = await sequelize.models.Classe.findAll();

    for (const classe of classes) {
      const moyennes = await sequelize.models.MoyenneGenerale.findAll({
        where: { annee, sequence },
        include: [{
          model: sequelize.models.Eleve,
          as: 'eleveMoyenneGenerale',
          where: { classe: classe.id }
        }],
        order: [['moyenne', 'DESC']]
      });

      // Mise à jour des rangs
      for (let i = 0; i < moyennes.length; i++) {
        await moyennes[i].update({ rang: i + 1 });
      }

      // Calcul des statistiques de la classe
      const nbEleves = moyennes.length;
      const moyenneClasse = nbEleves > 0 ? moyennes.reduce((acc, m) => acc + m.moyenne, 0) / nbEleves : 0;
      const moyennePremier = nbEleves > 0 ? moyennes[0].moyenne : 0;
      const moyenneDernier = nbEleves > 0 ? moyennes[nbEleves - 1].moyenne : 0;

      const [moyenneClasseRecord, created] = await sequelize.models.MoyenneClasse.findOrCreate({
        where: { classe: classe.id, sequence, annee },
        defaults: { moyenneClasse, moyennePremier, moyenneDernier }
      });

      if (!created) {
        // Si l'enregistrement existe déjà, on le met à jour
        moyenneClasseRecord.moyenneClasse = moyenneClasse;
        moyenneClasseRecord.moyennePremier = moyennePremier;
        moyenneClasseRecord.moyenneDernier = moyenneDernier;
        await moyenneClasseRecord.save();
      }

    }
  }
  return Note;
};  