from rest_framework import viewsets
from .models import Produto
from .serializers import ProdutoSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite Produtos serem vistos, editados ou excluídos.
    Mapeado pelo Router em /api/produtos/
    """
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer