from rest_framework import serializers
from .models import Coletor

class ColetorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coletor
        fields = '__all__'
