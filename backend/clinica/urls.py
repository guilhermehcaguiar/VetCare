from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TutorViewSet, PacienteViewSet, ConsultaViewSet

router = DefaultRouter()
router.register('tutores', TutorViewSet)
router.register('pacientes', PacienteViewSet)
router.register('consultas', ConsultaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]