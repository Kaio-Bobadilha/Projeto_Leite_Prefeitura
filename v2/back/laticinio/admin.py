from django.contrib import admin
from .models import Laticinio

@admin.register(Laticinio)
class LaticinioAdmin(admin.ModelAdmin):
    list_display = ('razao_social', 'cnpj', 'telefone')
    search_fields = ('razao_social', 'cnpj')
