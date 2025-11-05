"""
URL configuration for projeto_leite_back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
# Importe 'include' do django.urls
from django.urls import path, include
# Importe 'routers' do rest_framework
from rest_framework import routers

# 1. Importar os ViewSets criados
from apps.producers.views import ProdutorViewSet
from apps.logistics.views import EntregadorViewSet
from apps.products.views import ProdutoViewSet # Importar após criar o app 'products'

# 2. Criar um roteador e registrar os ViewSets
# O DefaultRouter lida automaticamente com os URLs e métodos HTTP (GET, POST, PUT, DELETE)
router = routers.DefaultRouter()
router.register(r'produtores', ProdutorViewSet) # Cria rotas para /api/produtores/
router.register(r'entregadores', EntregadorViewSet) # Cria rotas para /api/entregadores/
router.register(r'produtos', ProdutoViewSet) # Cria rotas para /api/produtos/

# 3. Incluir as rotas do Router no urlpatterns
urlpatterns = [
    path('admin/', admin.site.urls),
    # Rotas da API - acessíveis em /api/
    path('api/', include(router.urls)),
]