// models/Historique_paiement.js


class HistoriquePaiement  {

    constructor(id, datePaiement, montant, tranche, eleve) {
        this.id = id;
        this.datePaiement = datePaiement;
        this.montant = montant;
        this.tranche = tranche;
        this.eleve = eleve;
      }

}



module.exports = (sequelize,DataTypes) => {
  const HistoriquePaiement = sequelize.define("HistoriquePaiement",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    datePaiement: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    montant: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tranche: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TranchePaiement',
        key: 'id',
      },
    },
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Eleve',
        key: 'id',
      },
    },

  });
  return HistoriquePaiement;
};