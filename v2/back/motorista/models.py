from django.db import models

class Motorista(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    cnh = models.CharField(max_length=14, verbose_name="CNH")
    
    def __str__(self):
        return self.nome


class Veiculo(models.Model):
    placa = models.CharField(max_length=10, unique=True) 
    modelo = models.CharField(max_length=100, blank=True, null=True)
    compartimento = models.CharField(max_length=50, blank=True, null=True, verbose_name="Compartimento")

    def __str__(self):
        return f"{self.placa} ({self.modelo})"
