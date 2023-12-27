from django.shortcuts import render
from django.http import HttpResponse
from .models import Administrateur, Enseignant, Eleve, Parent, Note, Cours, Emplois, Jour, JourCours, Presence, TranchePaiement, HistoriquePaiement

# Exemple de vue pour afficher tous les enseignants
def liste_enseignants(request):
    enseignants = Enseignant.objects.all()
    return render(request, 'liste_enseignants.html', {'enseignants': enseignants})

# Exemple de vue pour afficher tous les élèves
def liste_eleves(request):
    eleves = Eleve.objects.all()
    return render(request, 'liste_eleves.html', {'eleves': eleves})

# Exemple de vue pour afficher toutes les notes
def liste_notes(request):
    notes = Note.objects.all()
    return render(request, 'liste_notes.html', {'notes': notes})

# Ajoutez d'autres vues en fonction de vos besoins

# N'oubliez pas d'ajuster les noms de vues et les templates en fonction de votre application.
