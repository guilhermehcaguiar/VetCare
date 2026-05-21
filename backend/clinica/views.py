from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Tutor, Paciente, Consulta
from .serializers import TutorSerializer, PacienteSerializer, ConsultaSerializer

# CRUDs padrão da clínica
class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all().order_by('-data_cadastro')
    serializer_class = TutorSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('nome')
    serializer_class = PacienteSerializer

class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all().order_by('data_hora')
    serializer_class = ConsultaSerializer


# Endpoint de Cadastro Público e Fluido
@api_view(['POST'])
@permission_classes([AllowAny])
def cadastrar_clinica(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password:
        return Response(
            {'error': 'Usuário e senha são obrigatórios.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Este nome de usuário/clínica já está cadastrado.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Cria o usuário
    User.objects.create_user(username=username, email=email, password=password)
    
    return Response(
        {'message': 'Clínica cadastrada com sucesso!'}, 
        status=status.HTTP_201_CREATED
    )