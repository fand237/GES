// models/Eleve.js





  
  module.exports = (sequelize,DataTypes) => {
    const Eleve = sequelize.define("Eleve",{
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
      dateNaissance: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      
      classe: {
        type: DataTypes.INTEGER,
      },
      parent: {
        type: DataTypes.INTEGER,
        
      },
      civilite: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ville: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "yaounde",

      },
      numeroIncremental: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      typeuser: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Eleve", // Définir la valeur par défaut ici

        
      },
  
    });

    Eleve.associate = (models) => {

      Eleve.belongsToMany(models.Conversation, {
        through: 'ConversationEleves',
        as: 'conversations',
        foreignKey: 'eleveId'
      });
     
      // Association avec le modèle Classe (Many-to-One)
      Eleve.belongsTo(models.Classe, {
        foreignKey: 'classe',
        as: 'classeEleve',
      });
  
      // Association avec le modèle Parent (Many-to-One)
      Eleve.belongsTo(models.Parent, {
        foreignKey: 'parent',
        as: 'parentEleve',  
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', // Active la mise à jour en cascade

      });
    };

    Eleve.checkOverlapUsername = async function (nomUtilisateur) {
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
  
    Eleve.checkOverlapEmail = async function (email) {
      try {
        const overlappingParent = await this.findAll({
          where: {
            email: email,
            
          },
          
        });
  
        return overlappingParent.length > 0;
      } catch (error) {
        console.error('Erreur lors de la vérification des chevauchements dans la base de données Email : ', error);
        throw error;
      }
    };

    
    return Eleve;
  };



