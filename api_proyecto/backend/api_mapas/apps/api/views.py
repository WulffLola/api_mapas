from rest_framework import viewsets
from .serializer import AddressSerializer
from .models import Address,Error
import requests
import json 
import psycopg2 
from rest_framework.response import Response
from django.db.models import Count

class AdressesViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
class syncAPIViewSet(viewsets.ViewSet):
    """
        rows= Address.objects.all()
        rows.delete()
    """
    def sync_addresses(sef, request):
        with open('data.json') as archivo:
            datos = json.load(archivo)
        for i in range(0,len(datos)) :
            codigo_postal =  datos[i]['CP_8_D1']
            calle =  datos[i]['CALLE_45_D1']
            altura = datos[i]['PUERTA_5_D1']
            partida = datos[i]['PARTIDA']
            nomenclatura = datos[i]['NOMENCLATURA_CAT']
            nomenclatura = nomenclatura.replace(" ","")
            localidad = datos[i]['LOCALIDAD_30_D1']        
            #Aca vamos a comprobar que la direccion no este cargada ya.
            if(calle != None) and (altura != None) and (codigo_postal != None) and (localidad !=None): 
                buscar = Address.objects.filter(codigo_postal=codigo_postal,calle=calle,altura=altura)
                if(buscar.count()==0): #No hay resultados, buscamos Lat y Lng.
                        toSearch = 'C=' + str(calle) + '&A=' + str(altura) + '&P=' + str(codigo_postal)
                        obtenerCoordenadas = requests.get('http://128.0.203.119/intranet/geo/cuimCalles.php?'+toSearch)
                        obtenerCoordenadas = json.loads(obtenerCoordenadas.text)
                        latitud = obtenerCoordenadas['lat']
                        longitud = obtenerCoordenadas['lng']
                        if(latitud=='' or longitud ==''):
                            #Consultamos en API web
                                toSearch = str(calle) + "+" + str(altura) + "+" + str(localidad)
                                obtenerCoordenadasWeb = requests.get('https://nominatim.openstreetmap.org/search.php?q='+toSearch+'&format=json')
                                obtenerCoordenadasWeb = json.loads(obtenerCoordenadasWeb.text)
                                if(len(obtenerCoordenadasWeb)>0):
                                    obtenerCoordenadasWeb = obtenerCoordenadasWeb[0]
                                    latitud = obtenerCoordenadasWeb['lat']
                                    longitud = obtenerCoordenadasWeb['lon'] 
                                    nueva_direccion = Address(codigo_postal = codigo_postal, calle = calle, altura = altura, partida = partida, nomenclatura = nomenclatura, latitud = latitud, longitud = longitud)
                                    nueva_direccion.save()
                                    print("Registro insertado correctamente." + " Contador: " +str(i))
                                else:
                                    #No obtiene de web, insertamos en el error pero antes verificamos que no este el error en la db ya
                                    error = "ERROR AL OBTENER LAT Y LNG DE LA DIRECCION."
                                    buscarError = Error.objects.filter(calle_conf=calle).filter(altura_conf = altura)
                                    if(buscarError.count()<1):
                                        nuevo_error = Error(detail=error, codigo_postal_conf=codigo_postal, calle_conf=calle, altura_conf=altura)
                                        nuevo_error.save()
                        try:
                            nueva_direccion = Address(codigo_postal = codigo_postal, calle = calle, altura = altura, partida = partida, nomenclatura = nomenclatura, latitud = latitud, longitud = longitud)
                            nueva_direccion.save()
                            print("Registro insertado correctamente." + " Contador: " +str(i))
                        except (Exception, psycopg2.Error) as error:
                            print("Error al insertar el registro:", error)
            else:
                    #Aca vamos a comprobar que el error no este en la cola
                    error = "NO HAY DATOS SUFICIENTES PARA BUSCAR LAT Y LNG." 
                    buscarError = Error.objects.filter(calle_conf=calle).filter(altura_conf = altura)
                    if(buscarError.count()<1):
                        nuevo_error = Error(detail=error, codigo_postal_conf=codigo_postal, calle_conf=calle, altura_conf=altura)
                        nuevo_error.save() 
    
class filterbyParams (viewsets.ViewSet):
    # queryset = Address.objects.all()
    serializer_class = AddressSerializer
    def list(self, request, codigo_postal=None, calle=None, altura=None):
        response = []        
        if(calle != None) and (altura != None) and (codigo_postal != None):
            buscar = Address.objects.filter(codigo_postal = codigo_postal.upper(), calle = calle.upper(), altura = altura).first()
            if(buscar):
                response = {
                    'code': 200,
                    'succcess' : True,
                    'data' : {
                            'ID' : buscar.id,
                            'CODIGO_POSTAL' : buscar.codigo_postal,
                            'CALLE' : buscar.calle,
                            'ALTURA' : buscar.altura,
                            'LATITUD' : buscar.latitud,
                            'LONGITUD' : buscar.longitud
                    }
                }
            else:
                res= {
                    'code': 404,
                    'succcess' : False,
                    'error' : "No se encontraron registros que coincidan con la búsqueda."
                }
        else:
            response = {
                    'code': 400,
                    'succcess' : False,
                    'error' : "Debe ingresar Codigo postal Calle y Altura válidas."
                }
        return Response(data=response, status=response.get('code'))
                    
class getErrorAddress (viewsets.ViewSet):
    def list(self, request):
        response = []        
        buscar = Error.objects.filter(detail='ERROR AL OBTENER LAT Y LNG DE LA DIRECCION.') \
                    .values('calle_conf','codigo_postal_conf') \
                    .annotate(detail_count = Count('calle_conf'))
        if(buscar.count()>0): #Tenemos registros que mostrar, los tenemos que recorrer.
            for x in buscar :
                obj = {
                    'CALLE_CONFLICTIVA' : x['calle_conf'],
                    'CODIGO_POSTAL' : x['codigo_postal_conf'],
                    'CALLE_NORMALIZADA' : ''
                }
                response.append(obj)
        res = {
            'code': 200,
            'succcess' : True,
            'data' : response
        }
        return Response(data=res, status=res.get('code'))
    
class getIncompletesAddress (viewsets.ViewSet):
        def list(self, request):
            response = []        
            buscar = Error.objects.filter(detail='NO HAY DATOS SUFICIENTES PARA BUSCAR LAT Y LNG.') \
                        .values('calle_conf','codigo_postal_conf','altura_conf')
            if(buscar.count()>0): #Tenemos registros que mostrar, los tenemos que recorrer.
                for x in buscar :
                    obj = {
                        'CODIGO_POSTAL' : x['codigo_postal_conf'],
                        'CALLE_CONFLICTIVA' : x['calle_conf'],
                        'ALTURA' : x['altura_conf']
                    }
                    response.append(obj)
            res = {
                'code': 200,
                'succcess' : True,
                'message' : 'LOS DATOS INGRESADOS PARA OBTENER LATITUD Y LONGITUD ESTAN INCOMPLETOS.',
                'data' : response
            }
            return Response(data=res, status=res.get('code'))