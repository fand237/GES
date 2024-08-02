// models/Parent.js




module.exports = (sequelize,DataTypes) => {
  const Parent = sequelize.define("Parent",{
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomUtilisateur: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    motDePasse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    indicatif: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numeroTelephone: {
      type: DataTypes.STRING,
      allowNull: false,
    }, profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quartier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    civilite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    situationMatriomiale: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numeroIncremental: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    typeuser: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Enseignant", // Définir la valeur par défaut ici

    },

  });

  Parent.checkOverlapUsername = async function (nomUtilisateur) {
    try {
      const overlappingParent = await this.findAll({
        where: {
          nomUtilisateur: nomUtilisateur,
          
        },
        
      });

      return overlappingParent.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données nom utilisateur : ', error);
      throw error;
    }
  };

  Parent.checkOverlapEmail = async function (email) {
    try {
      const overlappingParent = await this.findAll({
        where: {
          email: email,
          
        },
        
      });

      return overlappingParent.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données nom utilisateur : ', error);
      throw error;
    }
  };

  Parent.checkOverlapnumero = async function (indicatif,numero) {
    try {
      const overlappingParent = await this.findAll({
        where: {
          indicatif: indicatif,
          numeroTelephone: numero,
          
        },
        
      });

      return overlappingParent.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des chevauchements dans la base de données numero : ', error);
      throw error;
    }
  };

  return Parent;
};