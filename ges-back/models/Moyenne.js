module.exports = (sequelize, DataTypes) => {
  const Moyenne = sequelize.define("Moyenne", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    annee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    moyenne: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    moyennePonderee: {
      type: DataTypes.FLOAT,
      allowNull: true, // Calculée dynamiquement
    },
  });

  Moyenne.associate = (models) => {
    Moyenne.belongsTo(models.Eleve, {
      foreignKey: 'eleve',
      as: 'eleveMoyenne',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });


    Moyenne.belongsTo(models.Note, {
      foreignKey: 'cours',
      targetKey: 'cours',
      as: 'noteMoyenne',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE',
    });


    Moyenne.hasMany(models.Bulletin, {
      foreignKey: 'eleve',
      sourceKey: 'eleve',
      as: 'bulletinsEleve',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE',
    });

    Moyenne.hasMany(models.Bulletin, {
      foreignKey: 'cours',
      sourceKey: 'cours',
      as: 'bulletinsCours',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'CASCADE',
    });




    Moyenne.belongsTo(models.Cours, {
      foreignKey: 'cours',
      as: 'coursMoyenne',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Moyenne.belongsTo(models.Sequence, {
      foreignKey: 'sequence',
      as: 'sequenceMoyenne',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    Moyenne.belongsTo(models.Annee_Academique, {
      foreignKey: 'annee',
      as: 'anneeMoyenne',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  };

  // Ajoutez un hook avant la sauvegarde pour calculer la moyenne pondérée
  Moyenne.beforeSave(async (moyenne, options) => {
    const cours = await sequelize.models.Cours.findByPk(moyenne.cours);
    if (cours) {
      moyenne.moyennePonderee = moyenne.moyenne * cours.coefficient;
    }
  });

  Moyenne.checkOverlapMoyenne = async function (eleve, cours, sequence,annee) {
    try {
      const overlappingMoyenne = await this.findAll({
        where: {
          eleve: eleve,
          cours:cours,
          sequence:sequence,
          annee:annee,

        },

      });

      return overlappingMoyenne.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données groupe : ', error);
      throw error;
    }
  };

// Méthode pour calculer les statistiques par classe et par matière
  Moyenne.getStatistiques = async function (classeId, coursId, sequence, annee) {
    try {
      const moyennes = await this.findAll({
        where: { cours: coursId, sequence, annee },
        include: [
          { model: sequelize.models.Eleve, as: 'eleveMoyenne', where: { classe: classeId } },
          { model: sequelize.models.Cours, as: 'coursMoyenne' },
        ],
      });

      const totalEleves = moyennes.length;
      const totalGarcons = moyennes.filter(m => m.eleveMoyenne.civilite === 'Monsieur').length;
      const totalFilles = totalEleves - totalGarcons;

      const elevesAvecMoyenne = moyennes.filter(m => m.moyenne >= 10).length;
      const elevesSousMoyenne = totalEleves - elevesAvecMoyenne;

      const garconsAvecMoyenne = moyennes.filter(m => m.eleveMoyenne.civilite === 'M' && m.moyenne >= 10).length;
      const fillesAvecMoyenne = elevesAvecMoyenne - garconsAvecMoyenne;

      const pourcentageReussiteGarcons = totalGarcons ? (garconsAvecMoyenne / totalGarcons) * 100 : 0;
      const pourcentageReussiteFilles = totalFilles ? (fillesAvecMoyenne / totalFilles) * 100 : 0;
      const pourcentageReussiteTotal = totalEleves ? (elevesAvecMoyenne / totalEleves) * 100 : 0;

      return {
        totalEleves,
        totalGarcons,
        totalFilles,
        elevesAvecMoyenne,
        elevesSousMoyenne,
        garconsAvecMoyenne, // Nombre de garçons avec la moyenne
        fillesAvecMoyenne,  // Nombre de filles avec la moyenne
        pourcentageReussiteGarcons,
        pourcentageReussiteFilles,
        pourcentageReussiteTotal,
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques :', error);
      throw error;
    }
  };
  return Moyenne;
};