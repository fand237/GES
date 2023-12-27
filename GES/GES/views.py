# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Eleve
from .serializers import EleveSerializer

class EleveAPIView(APIView):
    def get(self, request):
        # Récupérer tous les élèves
        eleves = Eleve.objects.all()
        # Sérialiser les données pour les rendre compatibles avec JSON
        serializer = EleveSerializer(eleves, many=True)
        # Retourner la réponse au format JSON
        return Response(serializer.data)

    def post(self, request):
        # Désérialiser les données reçues en format JSON
        serializer = EleveSerializer(data=request.data)
        if serializer.is_valid():
            # Sauvegarder les données dans la base de données
            serializer.save()
            # Retourner la réponse au format JSON avec le statut 201 (Créé)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # En cas d'erreur de validation, retourner les erreurs avec le statut 400 (Bad Request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
