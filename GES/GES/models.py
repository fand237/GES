# models.py

from django.db import models

class Administrateur(models.Model):
    nom_utilisateur = models.CharField(max_length=255)
    mot_de_passe = models.CharField(max_length=255)
    email = models.EmailField()

class Enseignant(models.Model):
    nom_utilisateur = models.CharField(max_length=255)
    mot_de_passe = models.CharField(max_length=255)
    email = models.EmailField()
    matiere = models.IntegerField()
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    emplois_temps = models.IntegerField()

class Eleve(models.Model):
    nom_utilisateur = models.CharField(max_length=255)
    mot_de_passe = models.CharField(max_length=255)
    email = models.EmailField()
    matiere = models.CharField(max_length=255)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    date_naissance = models.DateField()
    note = models.IntegerField()
    classe = models.CharField(max_length=255)
    parent = models.IntegerField()

class Parent(models.Model):
    nom_utilisateur = models.CharField(max_length=255)
    mot_de_passe = models.CharField(max_length=255)
    email = models.EmailField()
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)

class Note(models.Model):
    eleve = models.ForeignKey(Eleve, on_delete=models.CASCADE)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    note = models.IntegerField()
    date_evaluation = models.DateField()

class Cours(models.Model):
    matiere = models.CharField(max_length=255)
    classe = models.CharField(max_length=255)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()

class Emplois(models.Model):
    classe = models.CharField(max_length=255)

class Jour(models.Model):
    jour = models.CharField(max_length=20, choices=[('Lundi', 'Lundi'), ('Mardi', 'Mardi'), ('Mercredi', 'Mercredi'), ('Jeudi', 'Jeudi'), ('Vendredi', 'Vendredi'), ('Samedi', 'Samedi'), ('Dimanche', 'Dimanche')])

class JourCours(models.Model):
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    emplois_temps = models.ForeignKey(Emplois, on_delete=models.CASCADE)
    jour = models.ForeignKey(Jour, on_delete=models.CASCADE)

class Presence(models.Model):
    eleve = models.ForeignKey(Eleve, on_delete=models.CASCADE)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)
    jour = models.ForeignKey(Jour, on_delete=models.CASCADE)

class TranchePaiement(models.Model):
    periode_scolaire = models.CharField(max_length=255)
    montant = models.IntegerField()
    date_echeance = models.DateField()
    statut = models.CharField(max_length=20, choices=[('en retard', 'En Retard')])
    eleve = models.ForeignKey(Eleve, on_delete=models.CASCADE)

class HistoriquePaiement(models.Model):
    date_paiement = models.DateField()
    montant = models.IntegerField()
    tranche = models.IntegerField()
    eleve = models.ForeignKey(Eleve, on_delete=models.CASCADE)
