from rest_framework import serializers
from .models import Entregador

class EntregadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entregador
        fields = '__all__'