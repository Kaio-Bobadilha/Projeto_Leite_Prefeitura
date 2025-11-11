from rest_framework import serializers
from .models import Produtor

class ProdutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produtor
        fields = '__all__' # Expõe todos os campos do modelo