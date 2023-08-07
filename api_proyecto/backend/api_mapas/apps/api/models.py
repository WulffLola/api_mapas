from django.db import models

class Address(models.Model):
    codigo_postal = models.CharField(max_length = 100, null=True)
    calle = models.CharField(max_length = 100, null=True)
    altura = models.CharField(max_length = 100, null=True)
    partida = models.CharField(max_length = 100, null=True)
    nomenclatura = models.CharField(max_length = 100, null=True)
    latitud = models.CharField(max_length=20,null=True)
    longitud = models.CharField(max_length=20,null=True)
    def __str__(self):
        return self.street