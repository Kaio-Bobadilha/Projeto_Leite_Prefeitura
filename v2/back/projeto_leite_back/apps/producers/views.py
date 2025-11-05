from django.shortcuts import render
from rest_framework import viewsets
from .models import Produtor
from .serializers import ProdutorSerializer

class ProdutorViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite Produtores serem vistos, editados ou excluídos.
    Mapeado pelo Router em /api/produtores/
    """
    queryset = Produtor.objects.all()
    serializer_class = ProdutorSerializer