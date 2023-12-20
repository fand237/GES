-- supprimer la base de données
DROP DATABASE GestionEtablissement;

-- Créer la base de données
CREATE DATABASE GestionEtablissement;

-- Utiliser la base de données
USE GestionEtablissement;

-- Créer la table Utilisateurs
CREATE TABLE Administrateur (
    ID INT PRIMARY KEY,
    NomUtilisateur VARCHAR(255),
    MotDePasse VARCHAR(255),
    Email VARCHAR(255)
    
    -- Ajoutez d'autres colonnes selon les besoins
);

-- Créer la table Enseignant
CREATE TABLE Enseignant (
    ID INT PRIMARY KEY,
    NomUtilisateur VARCHAR(255),
    MotDePasse VARCHAR(255),
    Email VARCHAR(255),
    Matiere INT,
    Nom VARCHAR(255),
    Prenom VARCHAR(255),
    emplois_temps INT

    
    -- Ajoutez d'autres colonnes selon les besoins

    
);



-- Créer la table Eleve
CREATE TABLE Eleve (
    ID INT PRIMARY KEY,
    NomUtilisateur VARCHAR(255),
    MotDePasse VARCHAR(255),
    Email VARCHAR(255),
    Matiere VARCHAR(255),
    Nom VARCHAR(255),
    Prenom VARCHAR(255),
    Date_naissance date,
    Note INT,
    classe VARCHAR(255),
    parent INT
    

    
    -- Ajoutez d'autres colonnes selon les besoins

    
);

-- Créer la table Parents
CREATE TABLE Parent (
    ID INT PRIMARY KEY,
    NomUtilisateur VARCHAR(255),
    MotDePasse VARCHAR(255),
    Email VARCHAR(255),
    Nom VARCHAR(255),
    Prenom VARCHAR(255)
    

    
    -- Ajoutez d'autres colonnes selon les besoins
);

-- Créer la table Note
CREATE TABLE Note (
    ID INT PRIMARY KEY,
    eleve INT,
    cours INT,
    note INT,
    Date_evaluation date
  
    
    -- Ajoutez d'autres colonnes selon les besoins

    
);

-- Créer la table Cours
CREATE TABLE Cours (
    ID INT PRIMARY KEY,
    Matiere VARCHAR(255),
    classe VARCHAR(255),
    heure_debut TIME,
    heure_fin TIME
  
    
    -- Ajoutez d'autres colonnes selon les besoins
);

-- Créer la table Emplois de temps
CREATE TABLE emplois (
    ID INT PRIMARY KEY,
    classe VARCHAR(255)
  
    
    -- Ajoutez d'autres colonnes selon les besoins
);

-- Créer la table jours
CREATE TABLE jour (
    ID INT PRIMARY KEY,
    jour ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche')
  
    
    -- Ajoutez d'autres colonnes selon les besoins
);

-- Créer la table jour_cours
CREATE TABLE Jour_cours (
    
    cours INT,
    emplois_temps INT,
    jour INT

  
    
    -- Ajoutez d'autres colonnes selon les besoins

    
);

-- Créer la table presence
CREATE TABLE presence (
    
    eleve INT,
    cours INT,
    jour INT
  
    
    -- Ajoutez d'autres colonnes selon les besoins

    
);

-- Créer la table Tranche paiement
CREATE TABLE Tranche_paiement (
    
    ID INT PRIMARY KEY,
    periode_scolaire VARCHAR(255),
    montant INT,
    date_echeance date,
    statut ENUM("en retard"),
    eleve INT
    
  
    
    -- Ajoutez d'autres colonnes selon les besoins

    
);

-- Créer la table Tranche paiement
CREATE TABLE historique_paiement (
    
    ID INT PRIMARY KEY,
    date_paiement date,
    montant INT,
    tranche INT,
    eleve INT
    
  
    
    -- Ajoutez d'autres colonnes selon les besoins

    
);



-- Créer d'autres tables en suivant le même modèle
-- ...


    -- Définir la clé étrangère
    ALTER TABLE Enseignant
    ADD FOREIGN KEY (emplois_temps) REFERENCES emplois(ID);

    ALTER TABLE Eleve
    -- Définir la clé étrangère
    ADD FOREIGN KEY (Note) REFERENCES Note(ID),
    -- Définir la clé étrangère
    ADD FOREIGN KEY (parent) REFERENCES Parent(ID);

    ALTER TABLE Note
    -- Définir la clé étrangère
    ADD FOREIGN KEY (eleve) REFERENCES Eleve(ID),
    -- Définir la clé étrangère
    ADD FOREIGN KEY (cours) REFERENCES Cours(ID);

    ALTER TABLE Jour_cours
    -- Définir la clé étrangère
    ADD FOREIGN KEY (cours) REFERENCES Cours(ID),
    -- Définir la clé étrangère
    ADD FOREIGN KEY (emplois_temps) REFERENCES emplois(ID),
    -- Définir la clé étrangère
    ADD FOREIGN KEY (jour) REFERENCES jour(ID);

    ALTER TABLE presence
    -- Définir la clé étrangère
    ADD FOREIGN KEY (eleve) REFERENCES Eleve(ID),
    -- Définir la clé étrangère
    ADD FOREIGN KEY (cours) REFERENCES Cours(ID),
    -- Définir la clé étrangère
    ADD FOREIGN KEY (jour) REFERENCES jour(ID);

    ALTER TABLE Tranche_paiement
    -- Définir la clé étrangère
    ADD FOREIGN KEY (eleve) REFERENCES Eleve(ID);

    ALTER TABLE historique_paiement
    -- Définir la clé étrangère
    ADD FOREIGN KEY (eleve) REFERENCES Eleve(ID);
    




-- Répétez cela pour les autres tables avec des clés étrangères
-- ...

-- Afficher les tables pour vérification
SHOW TABLES;
