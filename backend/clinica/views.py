from rest_framework import viewsets
from .models import Tutor, Paciente, Consulta
from .serializers import TutorSerializer, PacienteSerializer, ConsultaSerializer

class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all().order_by('-data_cadastro')
    serializer_class = TutorSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('nome')
    serializer_class = PacienteSerializer

class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all().order_by('data_hora')
    serializer_class = ConsultaSerializer