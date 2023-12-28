// models/Tranche_paiement.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('ges-back/sequelize-config.js');

class TranchePaiement extends Model {

    constructor(id, periodeScolaire, montant, dateEcheance, statut, eleve) {
        this.id = id;
        this.periodeScolaire = periodeScolaire;
        this.montant = montant;
        this.dateEcheance = dateEcheance;
        this.statut = statut;
        this.eleve = eleve;
      }


}

TranchePaiement.init(
  {
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
      references: {
        model: 'Eleve',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'TranchePaiement',
  }
);

module.exports = TranchePaiement;
