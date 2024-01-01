// models/Note.js


class Note  {

    constructor(eleve, cours, note, dateEvaluation) {
        this.eleve = eleve;
        this.cours = cours;
        this.note = note;
        this.dateEvaluation = dateEvaluation;
      }

}



module.exports = (sequelize,DataTypes) => {
  const Note = sequelize.define("Note",{
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    note: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateEvaluation: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  });
  return Note;
};