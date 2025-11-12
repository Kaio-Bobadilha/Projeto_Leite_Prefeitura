from django.db import models

class Coletor(models.Model):
    nome = models.CharField(max_length=255)
    matricula = models.CharField(max_length=50, unique=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.nome
