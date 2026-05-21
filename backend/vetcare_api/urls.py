from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from clinica.views import cadastrar_clinica

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('clinica.urls')),
    path('api/login/', obtain_auth_token),
    path('api/cadastrar/', cadastrar_clinica),
]