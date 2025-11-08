from django.db import models

# Modelo para o Entregador (Delivery Person)
class Entregador(models.Model):
    nome = models.CharField(max_length=100)
    cnh = models.CharField(max_length=20, unique=True)
    veiculo = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.nome