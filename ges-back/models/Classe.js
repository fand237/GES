// models/Classe.js





module.exports = (sequelize,DataTypes) => {
    const Classe = sequelize.define("Classe",{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      classe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacite: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cycle: {
        type: DataTypes.INTEGER,
      },
    });
  
    Classe.associate = (models) => {
      Classe.hasMany(models.Eleve, {
        foreignKey: 'classe',
        as: 'eleves',
      });
      // Association avec le modèle cycle (Many-to-One)
      Classe.belongsTo(models.Cycle, {
        foreignKey: 'cycle',
        as: 'CycleClasse',
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