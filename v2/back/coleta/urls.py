from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoteColetaViewSet, NaoConformidadeViewSet, AnaliseFisicoQuimicaViewSet, ControlePasteurizacaoViewSet, ControleAntibioticoViewSet, ResumoAdulterantesViewSet

router = DefaultRouter()

router.register(r'lotes-coleta', LoteColetaViewSet, basename='lotecoleta')
router.register(r'nao-conformidades', NaoConformidadeViewSet, basename='naoconformidade')
router.register(r'analises-fisico-quimicas', AnaliseFisicoQuimicaViewSet, basename='analisefisicoquimica')
router.register(r'controle-pasteurizacao', ControlePasteurizacaoViewSet, basename='controlepasteurizacao')
router.register(r'controle-antibiotico', ControleAntibioticoViewSet, basename='controleantibiotico')
router.register(r'resumo-adulterantes', ResumoAdulterantesViewSet, basename='resumoadulterantes')

urlpatterns = [
    path('', include(router.urls)),
]