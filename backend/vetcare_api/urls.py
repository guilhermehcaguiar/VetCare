from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from clinica.views import CreateUserView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rotas de Login (Geração de Token JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rota de Cadastro de Clínica
    path('api/users/', CreateUserView.as_view(), name='register'),
]