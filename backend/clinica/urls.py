from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import MedicoViewSet, TutorViewSet, PetViewSet, ConsultaViewSet, EstoqueItemViewSet, RegistroUsuarioView

router = DefaultRouter()
router.register(r'medicos', MedicoViewSet)
router.register(r'tutores', TutorViewSet)
router.register(r'pets', PetViewSet)
router.register(r'consultas', ConsultaViewSet)
router.register(r'estoque', EstoqueItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegistroUsuarioView.as_view(), name='api_register'), # Rota de Cadastro Real
    path('login/', obtain_auth_token, name='api_token_auth'), # Rota de Login Real do DRF
]