// models/Historique_paiement.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class HistoriquePaiement extends Model {

    constructor(id, datePaiement, montant, tranche, eleve) {
        this.id = id;
        this.datePaiement = datePaiement;
        this.montant = montant;
        this.tranche = tranche;
        this.eleve = eleve;
      }

}

HistoriquePaiement.init(
  {
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
  },
  {
    sequelize,
    modelName: 'HistoriquePaiement',
  }
);

module.exports = HistoriquePaiement;
