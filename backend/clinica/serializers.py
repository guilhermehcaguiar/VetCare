from rest_framework import serializers
from .models import Medico, Tutor, Pet, Consulta, EstoqueItem

class MedicoSerializer(serializers.ModelSerializer):
    nome_completo = serializers.ReadOnlyField(source='nome_com_prefixo')

    class Meta:
        model = Medico
        fields = ['id', 'nome', 'sexo', 'crmv', 'especialidade', 'nome_completo']


class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'


class TutorSerializer(serializers.ModelSerializer):
    pets = PetSerializer(many=True, read_only=True)

    class Meta:
        model = Tutor
        fields = ['id', 'nome', 'cpf', 'telefone', 'pets']


class ConsultaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consulta
        fields = '__all__'


class EstoqueItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstoqueItem
        fields = '__all__'