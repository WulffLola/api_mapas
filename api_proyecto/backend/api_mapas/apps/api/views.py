from rest_framework import viewsets
from .serializer import AddressSerializer
from .models import Address
import requests
import json 
import psycopg2

db_config = {
    'database': 'mapasdb',
    'user': 'mapasuser',
    'password': '123456*ñ',
    'host': '172.19.0.2',
    'port':'5432'
}


class AdressesViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class syncAPIViewSet():
    with open('data.json') as archivo:
        datos = json.load(archivo)
        
    for i in range(1):
        codigo_postal = datos[i]['CP_8_D1']
        calle = datos[i]['CALLE_45_D1']
        altura = datos[i]['PUERTA_5_D1']
        partida = datos[i]['PARTIDA']
        nomenclatura = datos[i]['NOMENCLATURA_CAT']
        nomenclatura = nomenclatura.replace(" ","")
        toSearch = 'C=' + calle + '&A=' + altura + '&P=' + codigo_postal
        obtenerCoordenadas = requests.get('http://128.0.203.119/intranet/geo/cuimCalles.php?'+toSearch)
        obtenerCoordenadas = json.loads(obtenerCoordenadas.text)
        latitud = obtenerCoordenadas['lat']
        longitud = obtenerCoordenadas['lng']
        try:
            # Conectarse a la base de datos
            connection = psycopg2.connect(db_config)

            # Crear un cursor para ejecutar comandos SQL
            cursor = connection.cursor()
            
            sql = "CREATE TABLE IF NOT EXISTS addresses (id SERIAL PRIMERY KEY,codigo_postal VARCHAR(100),calle VARCHAR(100),altura VARCHAR(100),partida VARCHAR(100),nomenclatura VARCHAR(100),latitud VARCHAR (100),longitud VARCHAR (100))"
            cursor.execute(sql)

            # Comando SQL para insertar el registro
           
            sql = "INSERT INTO api_address (codigo_postal,calle,altura,partida,nomenclatura,latitud,longitud) VALUES (%s, %s, %s, %s, %s, %s, %s)"  # Ajusta la tabla y los campos
            valores = [codigo_postal,calle,altura,partida,nomenclatura,latitud,longitud]  # Ajusta los campos correspondientes

            # Ejecutar el comando INSERT
            cursor.execute(sql, valores)

            # Confirmar la transacción (si estás utilizando una transacción explícita)
            connection.commit()

            # Cerrar el cursor y la conexión
            cursor.close()
            connection.close()

            print("Registro insertado correctamente.")
        except (Exception, psycopg2.Error) as error:
            print("Error al insertar el registro:", error)
        #addressToInsert = Address(address,number,lat,lng)
        
    """
    for i in range(1): #Toma valores de range(MAX) hasta MAX-1 (osea 100)
        address = response[i]['CALLE']
        for f in range(1):
            
            res2 = json.loads(res2.text)
            lat = res2['lat']
            lng = res2['lng']
            id = f
            #id=id[1]
            number = f #Guardamos la altura en la variable NUMERO            
            
    """