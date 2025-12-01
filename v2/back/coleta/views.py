from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from .models import LoteColeta, NaoConformidade, AnaliseFisicoQuimica, ControlePasteurizacao, ControleAntibiotico, ResumoAdulterantes

from .models import LoteColeta, NaoConformidade
from .serializers import (
    LoteColetaSerializer, 
    LoteColetaWriteSerializer,
    NaoConformidadeSerializer,
    RegistrarNCSerializer,
    AnaliseFisicoQuimicaSerializer,
    ControlePasteurizacaoSerializer, 
    ControleAntibioticoSerializer, 
    ResumoAdulterantesSerializer
)

class LoteColetaViewSet(viewsets.ModelViewSet):
    queryset = LoteColeta.objects.all().order_by('-data_coleta')
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LoteColetaWriteSerializer
        return LoteColetaSerializer

    @action(detail=True, methods=['post'], url_path='registrar-nc')
    def registrar_nao_conformidade(self, request, pk=None):
        lote = self.get_object()

        serializer = RegistrarNCSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            content_type = ContentType.objects.get_for_model(lote)

            serializer.save(
                content_type=content_type,
                object_id=lote.pk,
                responsavel_acao=request.user 
            )
            
            lote.status = 'NC'
            lote.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NaoConformidadeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NaoConformidade.objects.all()
    serializer_class = NaoConformidadeSerializer


class AnaliseFisicoQuimicaViewSet(viewsets.ModelViewSet):
    queryset = AnaliseFisicoQuimica.objects.all().order_by('-data_hora')
    serializer_class = AnaliseFisicoQuimicaSerializer

class ControlePasteurizacaoViewSet(viewsets.ModelViewSet):
    queryset = ControlePasteurizacao.objects.all().order_by('-created_at')
    serializer_class = ControlePasteurizacaoSerializer

class ControleAntibioticoViewSet(viewsets.ModelViewSet):
    queryset = ControleAntibiotico.objects.all().order_by('-created_at')
    serializer_class = ControleAntibioticoSerializer

class ResumoAdulterantesViewSet(viewsets.ModelViewSet):
    queryset = ResumoAdulterantes.objects.all().order_by('-created_at')
    serializer_class = ResumoAdulterantesSerializer