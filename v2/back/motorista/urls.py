from rest_framework.routers import DefaultRouter
from .views import MotoristaViewSet, VeiculoViewSet

router = DefaultRouter()
router.register(r'', MotoristaViewSet, basename='motorista')
router.register(r'veiculos', VeiculoViewSet, basename='veiculo')

urlpatterns = router.urls
