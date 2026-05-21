from django.contrib import admin
from .models import Medico, Tutor, Pet, Consulta, EstoqueItem

admin.site.register(Medico)
admin.site.register(Tutor)
admin.site.register(Pet)
admin.site.register(Consulta)
admin.site.register(EstoqueItem)