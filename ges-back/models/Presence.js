// models/Presence.js




module.exports = (sequelize,DataTypes) => {
  const Presence = sequelize.define("Presence",{
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    jour: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      
    },
    statut: {
      type: DataTypes.ENUM('Présent(e)', 'Absent(e)'),
      allowNull: false,
    },

    retard: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

  });

  Presence.checkOverlap = async function (eleveId, coursId, jour) {
    try {
      const overlappingPresence = await this.findAll({
        where: {
          eleve: eleveId,
          cours: coursId,
          jour: jour,
          
        },
        
      });

      return overlappingPresence.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données (JourCours) : ', error);
      throw error;
    }
  };

  Presence.associate = (models) => {
     
    // Association avec le modèle eleve (Many-to-One)
    Presence.belongsTo(models.Eleve, {
      foreignKey: 'eleve',
      as: 'elevePresence',
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
    });

    // Association avec le modèle Cours (Many-to-One)
    Presence.belongsTo(models.Cours, {
      foreignKey: 'cours',
      as: 'coursPresence',
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE', // Active la mise à jour en cascade

    }); 

    
  };
  return Presence;
};