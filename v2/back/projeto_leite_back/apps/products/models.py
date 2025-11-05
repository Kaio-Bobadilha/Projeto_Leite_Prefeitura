from django.db import models

# Modelo para o Produto (Product)
class Produto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(blank=True, null=True)
    preco_litro = models.DecimalField(max_digits=5, decimal_places=2)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.nome