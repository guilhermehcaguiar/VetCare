from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

# Importação dos modelos do seu sistema
from .models import Medico, Tutor, Pet, Consulta, EstoqueItem

# Importação dos serializers (Certifique-se de ter criado o UserSerializer no serializers.py)
from .serializers import (
    UserSerializer,
    MedicoSerializer, 
    TutorSerializer, 
    PetSerializer, 
    ConsultaSerializer, 
    EstoqueItemSerializer
)

# ==============================================================================
# AUTENTICAÇÃO E CADASTRO (COMPATÍVEL COM JWT)
# ==============================================================================
class CreateUserView(generics.CreateAPIView):
    """
    Controlador para criar a conta da clínica.
    O UserSerializer lidará com a criptografia da senha.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ==============================================================================
# VIEWSETS DO VETCARE OS
# ==============================================================================
class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all().order_by('nome')
    serializer_class = MedicoSerializer
    # permission_classes = [IsAuthenticated] # Descomente para bloquear acesso sem login

class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all().order_by('-id')
    serializer_class = TutorSerializer

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all().order_by('-id')
    serializer_class = PetSerializer

class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all().order_by('-id')
    serializer_class = ConsultaSerializer

class EstoqueItemViewSet(viewsets.ModelViewSet):
    queryset = EstoqueItem.objects.all().order_by('nome')
    serializer_class = EstoqueItemSerializer