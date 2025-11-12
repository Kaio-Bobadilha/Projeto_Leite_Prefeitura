from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoteColetaViewSet, NaoConformidadeViewSet

router = DefaultRouter()

router.register(r'lotes-coleta', LoteColetaViewSet, basename='lotecoleta')
router.register(r'nao-conformidades', NaoConformidadeViewSet, basename='naoconformidade')

urlpatterns = [
    path('', include(router.urls)),
]