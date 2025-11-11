from django.db import models
from produtor.models import Produtor

class Laticinio(models.Model):
    razao_social = models.CharField(max_length=100)
    cnpj = models.CharField(max_length=18, unique=True)
    inscricao_estadual = models.CharField(max_length=20, blank=True, null=True)
    regime_tributario = models.CharField(max_length=50)
    endereco = models.CharField(max_length=200)
    telefone = models.CharField(max_length=20)
    produtores = models.ManyToManyField(Produtor, related_name='laticinios')

    def __str__(self):
        return self.razao_social
