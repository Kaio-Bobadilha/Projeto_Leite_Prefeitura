from rest_framework import serializers
from .models import Laticinio

class LaticinioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Laticinio
        fields = '__all__'
