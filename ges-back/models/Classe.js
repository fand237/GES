// models/Classe.js
module.exports = (sequelize, DataTypes) => {
  const Classe = sequelize.define("Classe", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    classe: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    capacite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cycle: {
      type: DataTypes.INTEGER,
    },
    responsable: {
      type: DataTypes.INTEGER,
    },
    niveauId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  });

  Classe.associate = (models) => {
    Classe.hasMany(models.Eleve, {
      foreignKey: 'classe',
      as: 'eleves',
    });

    Classe.belongsTo(models.Cycle, {
      foreignKey: 'cycle',
      as: 'CycleClasse',
    });

    Classe.belongsTo(models.Enseignant, {
      foreignKey: 'responsable',
      as: 'ResponsableClasse',
    });

    // Correction de l'association avec Niveau
    Classe.belongsTo(models.Niveau, {
      foreignKey: 'niveauId',  // Utiliser niveauId comme clé étrangère
      as: 'NiveauClasse',
    });

    Classe.hasMany(models.PlanningExamen, {
      foreignKey: 'classe',
      as: 'Plannings',
    });
  };



    Classe.checkOverlapClasse = async function (classe) {
      try {
        const overlappingClasse = await this.findAll({
          where: {
            classe: classe,

          },

        });

        return overlappingClasse.length > 0;
      } catch (error) {
        console.error('Erreur lors de la vérification des chevauchements dans la base de données classe : ', error);
        throw error;
      }
    };


    return Classe;
  };