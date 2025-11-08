"""
Configuração de URLs para a API e o Admin.
Utiliza o DefaultRouter do DRF para criar as rotas RESTful automaticamente.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

# --- IMPORTAÇÕES DOS VIEWSETS DA API ---
# Importe os ViewSets dos apps que contêm a lógica CRUD da API
from apps.producers.views import ProdutorViewSet
from apps.logistics.views import EntregadorViewSet
# Certifique-se de que este app existe ou remova/comente se não existir
# from apps.products.views import ProdutoViewSet 


# --- CONFIGURAÇÃO DO ROUTER DRF ---
# Cria o roteador para mapear ViewSets para URLs
router = routers.DefaultRouter()
router.register(r'produtores', ProdutorViewSet)
router.register(r'entregadores', EntregadorViewSet)
# router.register(r'produtos', ProdutoViewSet) 


# --- DEFINIÇÃO DAS URLS PRINCIPAIS ---
urlpatterns = [
    # Rota para o painel de administração do Django
    path('admin/', admin.site.urls),
    
    # Rota para a API REST. Inclui todas as rotas definidas no router.
    # Os endpoints serão acessíveis em: http://127.0.0.1:8000/api/
    path('api/', include(router.urls)),
]