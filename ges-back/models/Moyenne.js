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
    });


    Moyenne.hasMany(models.Bulletin, {
      foreignKey: 'eleve',
      sourceKey: 'eleve',
      as: 'bulletinsEleve',
    });

    Moyenne.hasMany(models.Bulletin, {
      foreignKey: 'cours',
      sourceKey: 'cours',
      as: 'bulletinsCours',
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

  return Moyenne;
};