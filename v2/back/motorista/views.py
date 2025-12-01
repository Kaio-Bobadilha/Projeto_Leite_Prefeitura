from rest_framework import viewsets
from .models import Motorista, Veiculo
from .serializers import MotoristaSerializer, VeiculoSerializer

class MotoristaViewSet(viewsets.ModelViewSet):
    queryset = Motorista.objects.all()
    serializer_class = MotoristaSerializer
    lookup_value_regex = r'\d+'

class VeiculoViewSet(viewsets.ModelViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer
