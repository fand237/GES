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
      onDelete: 'SET NULL', // Définir la clé étrangère à NULL lors de la suppression de l'élève

    });

    // Association avec le modèle Sequence (Many-to-One)
    Note.belongsTo(models.Sequence, {
      foreignKey: 'sequence',
      as: 'sequenceNote',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'SET NULL', // Définir la clé étrangère à NULL lors de la suppression de l'élève


    });

    // Association avec le modèle Sequence (Many-to-One)
    Note.belongsTo(models.Cours, {
      foreignKey: 'cours',
      as: 'coursNote',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'SET NULL', // Définir la clé étrangère à NULL lors de la suppression de l'élève


    });

    // Association avec le modèle Sequence (Many-to-One)
    Note.belongsTo(models.Eleve, {
      foreignKey: 'eleve',
      as: 'eleveNote',
      onUpdate: 'CASCADE', // Active la mise à jour en cascade
      onDelete: 'SET NULL', // Définir la clé étrangère à NULL lors de la suppression de l'élève


    });
  };

  return Note;
};