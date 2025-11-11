from rest_framework import viewsets
from .models import Entregador
from .serializers import EntregadorSerializer

class EntregadorViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite Entregadores serem vistos, editados ou excluídos.
    Mapeado pelo Router em /api/entregadores/
    """
    queryset = Entregador.objects.all()
    serializer_class = EntregadorSerializer