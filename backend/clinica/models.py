from django.db import models

class Tutor(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
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
    nome = models.CharField(max_length=50)
    especie = models.CharField(max_length=15, choices=ESPECIE_CHOICES)
    raca = models.CharField(max_length=50, blank=True, null=True)
    data_nascimento = models.DateField(blank=True, null=True)
    peso_kg = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.nome} (Tutor: {self.tutor.nome})"


class Consulta(models.Model):
    STATUS_CHOICES = [
        ('AGENDADO', 'Agendado'),
        ('EM_ATENDIMENTO', 'Em Atendimento'),
        ('CONCLUIDO', 'Concluído'),
        ('CANCELADO', 'Cancelado'),
    ]

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='consultas')
    data_hora = models.DateTimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='AGENDADO')
    
    # Prontuário Médico (Preenchido pelo veterinário)
    queixa_principal = models.TextField(blank=True, null=True)
    diagnostico = models.TextField(blank=True, null=True)
    prescricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Consulta: {self.paciente.nome} - {self.data_hora.strftime('%d/%m/%Y %H:%M')}"
