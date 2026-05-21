from rest_framework import serializers
from .models import Tutor, Paciente, Consulta

class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutor
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    tutor_nome = serializers.ReadOnlyField(source='tutor.nome')

    class Meta:
        model = Paciente
        fields = '__all__'

class ConsultaSerializer(serializers.ModelSerializer):
    paciente_nome = serializers.ReadOnlyField(source='paciente.nome')
    tutor_nome = serializers.ReadOnlyField(source='paciente.tutor.nome')

    class Meta:
        model = Consulta
        fields = '__all__'