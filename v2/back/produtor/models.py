from django.db import models

class Produtor(models.Model):
    TIPO_PESSOA_CHOICES = [
        ('FISICA', 'Pessoa Física'),
        ('JURIDICA', 'Pessoa Jurídica'),
    ]

    TIPO_INSCRICAO_CHOICES = [
        ('CONTRIBUINTE_DE_ICMS', 'Contribuinte de ICMS'),
        ('NAO_CONTRIBUINTE_DE_ICMS', 'Não contribuinte de ICMS'),
        ('CONTRIBUINTE_ISENTO', 'Contribuinte isento'),
    ]

    tipo_pessoa = models.CharField(max_length=10, choices=TIPO_PESSOA_CHOICES)
    nome = models.CharField(max_length=100, blank=True, null=True)
    razao_social = models.CharField(max_length=100, blank=True, null=True)
    nome_fantasia = models.CharField(max_length=100, blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    cad_pro = models.CharField(max_length=30, blank=True, null=True)

    tipo_inscricao_estadual = models.CharField(max_length=30, choices=TIPO_INSCRICAO_CHOICES)
    inscricao_estadual = models.CharField(max_length=20, blank=True, null=True)
    inscricao_municipal = models.CharField(max_length=20, blank=True, null=True)

    email = models.EmailField(max_length=100)
    telefone = models.CharField(max_length=20, blank=True, null=True)

    # Endereço
    estado = models.CharField(max_length=2)
    cidade = models.CharField(max_length=100)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    rua = models.CharField(max_length=150)
    numero = models.CharField(max_length=10, blank=True, null=True)
    complemento = models.CharField(max_length=150, blank=True, null=True)

    def __str__(self):
        return self.nome or self.razao_social
