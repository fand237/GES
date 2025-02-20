// models/Historique_paiement.js






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
      
    },
    eleve: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },

  });
  return HistoriquePaiement;
};