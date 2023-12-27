# models.py
from django.db import models

class Eleve(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    # Ajoutez d'autres champs si nécessaire
