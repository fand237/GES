// models/Tranche_paiement.js


class TranchePaiement  {

    constructor(id, periodeScolaire, montant, dateEcheance, statut, eleve) {
        this.id = id;
        this.periodeScolaire = periodeScolaire;
        this.montant = montant;
        this.dateEcheance = dateEcheance;
        this.statut = statut;
        this.eleve = eleve;
      }


}



module.exports = (sequelize,DataTypes) => {
  const TranchePaiement = sequelize.define("TranchePaiement",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    periodeScolaire: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    montant: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateEcheance: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    statut: {
      type: DataTypes.ENUM('en retard'),
    },
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },

  });
  return TranchePaiement;
};