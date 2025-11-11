from django.contrib import admin
from .models import Produtor

@admin.register(Produtor)
class ProdutorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'cnpj', 'email', 'cidade', 'estado')
    search_fields = ('nome', 'cpf', 'cnpj', 'email')
    list_filter = ('tipo_pessoa', 'estado')
