from django.db import models
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from produtor.models import Produtor
from motorista.models import Motorista, Veiculo

class LoteColeta(models.Model):

    status_coleta = [
        ('C', 'Coletado'),
        ('NC', 'NaoColetado'),
    ]

    produtor = models.ForeignKey(Produtor, on_delete=models.PROTECT, related_name="lotes_coletados")
    motorista = models.ForeignKey(Motorista, on_delete=models.SET_NULL, null=True, related_name="coletas_realizadas")
    veiculo = models.ForeignKey(Veiculo, on_delete=models.SET_NULL, null=True, related_name="lotes_transportados")
    responsavel_carregamento = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="coletas_supervisionadas")
    
    data_coleta = models.DateTimeField(verbose_name="Data e Hora da Coleta")
    numero_tanque_produtor = models.CharField(max_length=50, verbose_name="Nº Tanque na Propriedade")
 
    temperatura_coleta = models.FloatField(verbose_name="Temperatura (02-09ºC)")
    alizarol_coleta = models.FloatField(verbose_name="Alizarol (75-80ºGL)")
    
    status = models.CharField(max_length=2, choices=status_coleta, verbose_name="Status (C/NC)")
    coletado = models.BooleanField(default=True, help_text="Desmarcar se o leite foi rejeitado e não coletado")

    def __str__(self):
        return f"Coleta {self.id} - Prod. {self.produtor.codigo_produtor} em {self.data_coleta.strftime('%d/%m/%Y')}"


class NaoConformidade(models.Model):

    data_hora = models.DateTimeField(auto_now_add=True, verbose_name="Data/Hora da NC")
    descricao = models.TextField(verbose_name="Descrição da Não Conformidade")
    acao_corretiva = models.TextField(verbose_name="Descrição da Ação Corretiva")
    prazo_execucao = models.DateField(verbose_name="Prazo para Realização", null=True, blank=True)
    responsavel_acao = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="acoes_corretivas_responsaveis")
    
    data_retomada = models.DateTimeField(verbose_name="Retomada (Data e Hora)", null=True, blank=True)
    verificacao_execucao = models.TextField(verbose_name="Verificação da Execução", blank=True, null=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f"NC {self.id} - {self.descricao[:50]}..."


class AnaliseFisicoQuimica(models.Model):
    data_hora = models.DateTimeField(verbose_name="Data e Hora")
    temperatura = models.FloatField(verbose_name="Temperatura (°C)")
    ph = models.FloatField(verbose_name="pH")
    acidez = models.FloatField(verbose_name="Acidez (%)")
    densidade = models.FloatField(verbose_name="Densidade (g/cm³)")
    crioscopia = models.FloatField(verbose_name="Crioscopia (°C)")
    gordura = models.FloatField(verbose_name="Gordura (%)")
    proteina = models.FloatField(verbose_name="Proteína (%)")
    esd = models.FloatField(verbose_name="ESD")
    est = models.FloatField(verbose_name="EST")
    lactose = models.FloatField(verbose_name="Lactose (%)")
    antibioticos = models.CharField(max_length=100, verbose_name="Antibióticos", blank=True, null=True)
    conservantes = models.CharField(max_length=100, verbose_name="Conservantes", blank=True, null=True)
    analista = models.CharField(max_length=200, verbose_name="Analista Responsável")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Análise {self.id} - {self.data_hora}"