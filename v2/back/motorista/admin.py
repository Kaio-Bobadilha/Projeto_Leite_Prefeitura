from django.contrib import admin
from .models import Motorista, Veiculo

@admin.register(Motorista)
class MotoristaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'cnh', 'telefone')
    search_fields = ('nome', 'cpf')

@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'modelo', 'compartimento')
    search_fields = ('placa', 'modelo')