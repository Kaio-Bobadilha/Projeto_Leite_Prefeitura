from rest_framework.routers import DefaultRouter
from .views import ColetorViewSet

router = DefaultRouter()
router.register(r'', ColetorViewSet, basename='coletor')

urlpatterns = router.urls
