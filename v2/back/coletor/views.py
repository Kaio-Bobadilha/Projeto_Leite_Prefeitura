from rest_framework import viewsets
from .models import Coletor
from .serializers import ColetorSerializer

class ColetorViewSet(viewsets.ModelViewSet):
    queryset = Coletor.objects.all()
    serializer_class = ColetorSerializer
