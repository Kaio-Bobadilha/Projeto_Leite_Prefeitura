from django.contrib import admin
from .models import LoteColeta, NaoConformidade, AnaliseFisicoQuimica, ControlePasteurizacao, ControleAntibiotico, ResumoAdulterantes

# Registra as tabelas para aparecerem no painel administrativo
    
@admin.register(LoteColeta)
class LoteColetaAdmin(admin.ModelAdmin):
    list_display = ('data_coleta', 'produtor', 'motorista', 'status')
    list_filter = ('status', 'data_coleta')

@admin.register(NaoConformidade)
class NaoConformidadeAdmin(admin.ModelAdmin):
    list_display = ('data_hora', 'descricao', 'responsavel_acao')

@admin.register(AnaliseFisicoQuimica)
class AnaliseFisicoQuimicaAdmin(admin.ModelAdmin):
    list_display = ('data_hora', 'analista', 'temperatura', 'ph')
    list_filter = ('data_hora', 'analista')

    def alizarol_status(self, obj):
        return "Normal" if obj.acidez >= 14 and obj.acidez <= 18 else "Alterado"
    alizarol_status.short_description = "Status Acidez"

@admin.register(ControlePasteurizacao)
class ControlePasteurizacaoAdmin(admin.ModelAdmin):
    list_display = ('data', 'hora', 'status', 'responsavel')
    list_filter = ('status', 'data')

@admin.register(ControleAntibiotico)
class ControleAntibioticoAdmin(admin.ModelAdmin):
    list_display = ('data', 'hora', 'classe', 'resultado', 'status')
    list_filter = ('status', 'classe')

@admin.register(ResumoAdulterantes)
class ResumoAdulterantesAdmin(admin.ModelAdmin):
    list_display = ('data_hora', 'nome_produtor', 'analista')
    search_fields = ('nome_produtor', 'codigo_produtor')