from django.contrib import admin
from .models import Tutor, Paciente, Consulta

# Customizando a exibição das tabelas no painel administrativo
@admin.register(Tutor)
class TutorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cpf', 'telefone', 'data_cadastro')
    search_fields = ('nome', 'cpf')

@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('nome', 'especie', 'raca', 'tutor')
    list_filter = ('especie',)
    search_fields = ('nome', 'tutor__nome')

@admin.register(Consulta)
class ConsultaAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'data_hora', 'status')
    list_filter = ('status', 'data_hora')