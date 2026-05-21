from django.db import models

class Medico(models.Model):
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Feminino'),
    ]
    nome = models.CharField(max_length=150)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, default='M')
    crmv = models.CharField(max_length=20, unique=True)
    especialidade = models.CharField(max_length=100, default='Clínico Geral')

    @property
    def nome_com_prefixo(self):
        if self.sexo == 'F':
            return f"Dra. {self.nome}"
        return f"Dr. {self.nome}"

    def __str__(self):
        return self.nome_com_prefixo


class Tutor(models.Model):
    nome = models.CharField(max_length=150)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20, default='Não informado')

    def __str__(self):
        return self.nome


class Pet(models.Model):
    tutor = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='pets')
    nome = models.CharField(max_length=100)
    especie = models.CharField(max_length=50)
    raca = models.CharField(max_length=100, default='Sem Raça Definida (SRD)')
    peso = models.CharField(max_length=10, default='--')

    def __str__(self):
        return f"{self.nome} ({self.especie})"


class Consulta(models.Model):
    petNome = models.CharField(max_length=150)
    medicoNome = models.CharField(max_length=150)
    motivo = models.CharField(max_length=255)
    data = models.CharField(max_length=20) 
    hora = models.CharField(max_length=10) 
    status = models.CharField(max_length=20, default='agendada')
    prontuario = models.JSONField(null=True, blank=True, default=dict)

    def __str__(self):
        return f"{self.petNome} - {self.data} às {self.hora}"


class EstoqueItem(models.Model):
    nome = models.CharField(max_length=150)
    categoria = models.CharField(max_length=100, default='Medicamentos')
    quantidade = models.IntegerField(default=0)
    limiteMinimo = models.IntegerField(default=5)

    def __str__(self):
        return f"{self.nome} ({self.quantidade} u)"