from django.db import models

class Veiculo(models.Model):
    placa = models.CharField(max_length=10, unique=True)
    modelo = models.CharField(max_length=100, blank=True, null=True)
    compartimento = models.CharField(max_length=50, blank=True, null=True, verbose_name="Compartimento")
    

    def __str__(self):
        return f"{self.placa} ({self.modelo})"


class Motorista(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    telefone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Telefone")
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF", null=True, blank=True)
    cnh = models.CharField(max_length=20, verbose_name="CNH")
    validade_cnh = models.DateField(verbose_name="Validade da CNH", null=True, blank=True)

    veiculo = models.OneToOneField(Veiculo, on_delete=models.CASCADE, related_name="motorista", null=True, blank=True)

    def __str__(self):
        return f"{self.nome} ({self.cpf}) - {self.veiculo.placa if self.veiculo else 'Sem veículo'}"