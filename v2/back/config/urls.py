from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from produtor.views import ProdutorViewSet
from laticinio.views import LaticinioViewSet

router = routers.DefaultRouter()
router.register(r'produtores', ProdutorViewSet)
router.register(r'laticinios', LaticinioViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
