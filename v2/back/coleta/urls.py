from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoteColetaViewSet, NaoConformidadeViewSet, AnaliseFisicoQuimicaViewSet

router = DefaultRouter()

router.register(r'lotes-coleta', LoteColetaViewSet, basename='lotecoleta')
router.register(r'nao-conformidades', NaoConformidadeViewSet, basename='naoconformidade')
router.register(r'analises-fisico-quimicas', AnaliseFisicoQuimicaViewSet, basename='analisefisicoquimica')

urlpatterns = [
    path('', include(router.urls)),
]