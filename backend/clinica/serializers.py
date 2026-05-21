from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Medico, Tutor, Pet, Consulta, EstoqueItem

# ==============================================================================
# SERIALIZER DE USUÁRIO (Criação de Conta e Criptografia)
# ==============================================================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        # Proteção: impede que a senha seja enviada de volta em requisições de leitura
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # O 'create_user' é obrigatório aqui, é ele quem faz o hash da senha pro banco!
        user = User.objects.create_user(**validated_data)
        return user


# ==============================================================================
# SERIALIZERS DO SISTEMA VETCARE
# ==============================================================================
class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields = '__all__'

class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutor
        fields = '__all__'

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'

class ConsultaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consulta
        fields = '__all__'

class EstoqueItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstoqueItem
        fields = '__all__'