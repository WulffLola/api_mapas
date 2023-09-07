from django.db import models

class Address(models.Model):
    id = models.AutoField(primary_key=True)
    codigo_postal = models.CharField(max_length = 100, null=True)
    calle = models.CharField(max_length = 100, null=True)
    altura = models.CharField(max_length = 100, null=True)
    partida = models.CharField(max_length = 100, null=True)
    nomenclatura = models.CharField(max_length = 100, null=True)
    latitud = models.CharField(max_length=20,null=True)
    longitud = models.CharField(max_length=20,null=True)
    def __str__(self):
        data = {
            'ID' : self.id,
            'CODIGO_POSTAL' : self.codigo_postal,
            'CALLE' : self.calle,
            'ALTURA' : self.altura,
            'LATITUD' : self.latitud,
            'LONGITUD' : self.longitud
        }
        return str(data)

class Error(models.Model):
    id = models.AutoField(primary_key=True)
    detail = models.TextField(null=False)
    codigo_postal = models.CharField(max_length = 100, null=True)
    calle = models.CharField(max_length = 100, null=True)
    altura = models.CharField(max_length = 100, null=True)
    partida = models.CharField(max_length = 100, null=True)
    nomenclatura = models.CharField(max_length = 100, null=True)
    def __str__(self):
        data = {
            'ID' : self.id,
            'DETALLE' : self.detail,
            'CODIGO_POSTAL' : self.codigo_postal,
            'CALLE' : self.calle,
            'ALTURA' : self.altura,
            'PARTIDA' : self.partida,
            'NOMENCLATURA' : self.nomenclatura,
        }
        return str(data)
    
class HojaDeRuta(models.Model):
    id = models.AutoField(primary_key=True)
    fecha = models.TextField(null=False)
    codigo_postal = models.CharField(max_length = 100, null=True)
    calle = models.CharField(max_length = 100, null=True)
    altura = models.CharField(max_length = 100, null=True)
    partida = models.CharField(max_length = 100, null=True)
    nomenclatura = models.CharField(max_length = 100, null=True)
    def __str__(self):
        data = {
            'ID' : self.id,
        }
        return str(data)
    
class Oficios(models.Model):
    id = models.AutoField(primary_key=True)
    fecha = models.DateField(null=True)
    tipo = models.CharField(max_length = 100, null=True)
    detalle = models.CharField(max_length = 100, null=True)
    calle = models.CharField(max_length = 100, null=True)
    altura = models.CharField(max_length = 100, null=True)
    estado = models.CharField(max_length = 100, null=True)
    id_hoja_ruta = models.IntegerField(null=True)
    latitud = models.CharField(max_length=50,null=True)
    longitud = models.CharField(max_length=50,null=True)
    def __str__(self):
        data = {
            'ID' : self.id,
            'FECHA' : self.fecha,
            'TIPO' : self.tipo,
            'CALLE' : self.calle,
            'ALTURA' : self.altura,
            'ESTADO' : self.estado,
            'HOJA DE RUTA' : self.id_hoja_ruta,
            'DETALLE' : self.detalle,
            'LATITUD' : self.latitud,
            'LONGITUD' : self.longitud
        }
        return str(data)
    