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
      references: {
        model: 'Eleve',
        key: 'id',
      },
    },
    cours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cours',
        key: 'id',
      },
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