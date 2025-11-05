from django.db import models

# Modelo para o Produtor (Producer)
class Produtor(models.Model):
    nome = models.CharField(max_length=100)
    documento = models.CharField(max_length=20, unique=True)
    endereco = models.CharField(max_length=255)
    telefone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.nome