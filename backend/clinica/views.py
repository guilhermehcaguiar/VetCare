from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Medico, Tutor, Pet, Consulta, EstoqueItem
from .serializers import MedicoSerializer, TutorSerializer, PetSerializer, ConsultaSerializer, EstoqueItemSerializer

# CONTROLADOR NATIVO PARA CRIAR CONTAS DE CLÍNICAS (SEM GAMBIARRA)
class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Usuário e senha são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Este nome de clínica já está cadastrado.'}, status=status.HTTP_400_BAD_REQUEST)

        # Cria o usuário criptografando a senha no padrão PBKDF2 do Django
        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Gera o token definitivo de acesso para o React
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'username': user.username
        }, status=status.HTTP_201_CREATED)


class MedicoViewSet(viewsets.ModelViewSet):
    queryset = Medico.objects.all().order_by('nome')
    serializer_class = MedicoSerializer

class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all().order_by('-id')
    serializer_class = TutorSerializer

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all().order_by('-id')
    serializer_class = PetSerializer

class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all().order_by('-id')
    serializer_class = ConsultaSerializer
    permission_classes = [AllowAny]

class EstoqueItemViewSet(viewsets.ModelViewSet):
    queryset = EstoqueItem.objects.all().order_by('nome')
    serializer_class = EstoqueItemSerializer