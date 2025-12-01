from rest_framework import serializers
from .models import LoteColeta, NaoConformidade
from django.contrib.contenttypes.models import ContentType
from .models import LoteColeta, NaoConformidade, AnaliseFisicoQuimica, ControlePasteurizacao, ControleAntibiotico, ResumoAdulterantes

class LoteColetaSerializer(serializers.ModelSerializer):
    produtor = serializers.StringRelatedField()
    motorista = serializers.StringRelatedField()
    veiculo = serializers.StringRelatedField()
    responsavel_carregamento = serializers.StringRelatedField()

    class Meta:
        model = LoteColeta
        fields = [
            'id',
            'produtor',
            'motorista',
            'veiculo',
            'responsavel_carregamento',
            'data_coleta',
            'numero_tanque_produtor',
            'temperatura_coleta',
            'alizarol_coleta',
            'status',
            'coletado',
        ]
        
        
    def __init__(self, *args, **kwargs):    
        is_post = self.context.get('request') and self.context['request'].method == 'POST'
        if not is_post:
            kwargs['depth'] = 1 
        super().__init__(*args, **kwargs)


class LoteColetaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoteColeta
        fields = [
            'produtor',
            'motorista',
            'veiculo',
            'responsavel_carregamento',
            'data_coleta',
            'numero_tanque_produtor',
            'temperatura_coleta',
            'alizarol_coleta',
            'status',
            'coletado',
        ]


class NaoConformidadeSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = NaoConformidade
        fields = '__all__'


class RegistrarNCSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaoConformidade
        fields = [
            'descricao',
            'acao_corretiva',
            'prazo_execucao',
            'responsavel_acao',
        ]

class AnaliseFisicoQuimicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnaliseFisicoQuimica
        fields = '__all__'

class ControlePasteurizacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlePasteurizacao
        fields = '__all__'

class ControleAntibioticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControleAntibiotico
        fields = '__all__'

class ResumoAdulterantesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumoAdulterantes
        fields = '__all__'