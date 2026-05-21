from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# SIGNAL AUTOMÁTICO: Cria o token sempre que um usuário/clínica for criado
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def criar_token_usuario(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


# Modelos da Clínica
class Tutor(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20)
    email = models.EmailField()
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Paciente(models.Model):
    ESPECIE_CHOICES = [
        ('CACHORRO', 'Cachorro'),
        ('GATO', 'Gato'),
        ('AVE', 'Ave'),
        ('OUTRO', 'Outro'),
    ]
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='pacientes')
    nome = models.CharField(max_length=100)
    especie = models.CharField(max_length=20, choices=ESPECIE_CHOICES)
    raca = models.CharField(max_length=50, blank=True, null=True)
    data_nascimento = models.DateField(blank=True, null=True)
    peso_kg = models.DecimalField(max_length=5, decimal_places=2, max_digits=5, blank=True, null=True)

    def __str__(self):
        return f"{self.nome} ({self.tutor.nome})"

class Consulta(models.Model):
    STATUS_CHOICES = [
        ('AGENDADO', 'Agendado'),
        ('EM_ATENDIMENTO', 'Em Atendimento'),
        ('CONCLUIDO', 'Concluído'),
        ('CANCELADO', 'Cancelado'),
    ]
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='consultas')
    data_hora = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AGENDADO')
    queixa_principal = models.TextField()
    diagnostico = models.TextField(blank=True, null=True)
    prescricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Consulta: {self.paciente.nome} - {self.data_hora.strftime('%d/%m/%Y %H:%M')}"