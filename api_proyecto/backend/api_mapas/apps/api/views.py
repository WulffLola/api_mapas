from rest_framework import viewsets
from .serializer import AddressSerializer, OficiosSerializer
from django.core.serializers import serialize
from .models import Address,Error, Oficios
import requests
import json 
import psycopg2 
from rest_framework.response import Response
from django.db.models import Count
import math


class AdressesViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    
class syncAPIViewSet(viewsets.ViewSet):
    def normalizarDireccion (row):
        with open('CALLES_CONFLICTIVAS.json') as file:
            datos = json.load(file)
            datos = datos['data']
            for x in datos:
                if(x['CALLE_CONFLICTIVA'] == row['CALLE_45_D1']) and (x['CODIGO_POSTAL'] == row['CP_8_D1']):
                    if(x['CALLE_NORMALIZADA'] != ''):
                        row['CALLE_45_D1'] = x['CALLE_NORMALIZADA']                    
        return row
    
    def obtenerCiudad (codigo_postal):
        with open('CODIGO_POSTAL.json') as file:
            datos = json.load(file)
            for x in datos:
                if(x['CODIGO_POSTAL'] == codigo_postal):
                    return x['CIUDAD']

    def existeDireccion(row):
        buscarDireccion = Address.objects.filter(codigo_postal=row['CP_8_D1']).filter(calle=row['CALLE_45_D1']).filter(altura=row['PUERTA_5_D1'])
        if(buscarDireccion.count()>0):
            return True
        return False
    
    def obtenerDatosAPI(url):
        obtenerCoordenadas = requests.get(url)
        obtenerCoordenadas = json.loads(obtenerCoordenadas.text)
        return obtenerCoordenadas
    
    def insertarRegistro(row,i):
        try:
            nueva_direccion = Address(codigo_postal = row['CP_8_D1'], calle = row['CALLE_45_D1'], altura = row['PUERTA_5_D1'], partida = row['PARTIDA'], nomenclatura = row['NOMENCLATURA_CAT'], latitud = row['LATITUD'], longitud = row['LONGITUD'])
            nueva_direccion.save()
            print("Registro insertado correctamente." + " Contador: " +str(i))    
        except (Exception, psycopg2.Error) as error:
            print("Error al insertar el registro:", error)
            
    def insertarError(row,error,i):
        buscarError = Error.objects.filter(codigo_postal=row['CP_8_D1']).filter(calle=row['CALLE_45_D1']).filter(altura=row['PUERTA_5_D1']).filter(detail = error)
        if(buscarError.count()<1):
            try:
                nuevo_error = Error(detail = error, codigo_postal = row['CP_8_D1'], calle = row['CALLE_45_D1'], altura = row['PUERTA_5_D1'], partida = row['PARTIDA'], nomenclatura = row['NOMENCLATURA_CAT'])
                nuevo_error.save()
                print("Error insertado."  " Contador: " +str(i))    
            except (Exception, psycopg2.Error) as error:
                print("Error al insertar el error:", error)
    
    def ordenarDirecciones (self,request):
        print(request)
        """
        body = json.loads(body_unicode)
        direcciones = body['data']
        latitud_origen = "-38.7162124291"
        longitud_orgen = "-62.2745471692"
        data = []
        print (direcciones)
        for x in direcciones :
            id = x['id']
            latitud = x['latitud']
            longitud = x['longitud']
            distancia = math.sqrt((longitud-longitud_orgen)**2+(latitud-latitud_origen)**2)
            item = {
                'ID' : id,
                'DISTANCIA_AL_ORIGEN' : distancia
            }
            data.append(item)
            
        #Una vez calculadas las distancias entre puntos, las ordenamos de menor a mayor. 
            
        sorted(data, key=lambda x: x['DISTANCIA_AL_ORIGEN'])  
        
        res = {
            'code': 200,
            'succcess' : True,
            'data' : data
        }            
            
        return Response(data=res, status=res.get('code'))
        """
        return Response(data=[], status=200)

        
    def sync_addresses(self, request):
        repetidos = 0
        with open('data.json') as archivo:
            datos = json.load(archivo)
            for i in range(0,len(datos)) :                
                print("Rg. "+str(i))
                row = datos[i]
                if(row['CP_8_D1'] is not None) and (row['CALLE_45_D1'] is not None) and (row['PUERTA_5_D1'] is not None) and (row['LOCALIDAD_30_D1'] is not None):
                    row = self.normalizarDireccion(row)
                    if self.existeDireccion(row) == False:
                        toSearch = 'C=' + str(row['CALLE_45_D1']) + '&A=' + str(row['PUERTA_5_D1']) + '&P=' + str(row['CP_8_D1'])
                        data = self.obtenerDatosAPI('http://128.0.203.119/intranet/geo/cuimCalles.php?'+toSearch)
                        latitud = data['lat']
                        longitud = data['lng']
                        if (latitud != '') and (longitud != ''):
                            row['LATITUD'] = latitud
                            row['LONGITUD'] = longitud
                            self.insertarRegistro(row,i)
                        else:
                            toSearch = str(row['CALLE_45_D1']) + "+" + str(row['PUERTA_5_D1']) + "+" + str(row['LOCALIDAD_30_D1'])
                            data = self.obtenerDatosAPI('https://nominatim.openstreetmap.org/search.php?q='+toSearch+'&format=json')
                            if(len(data)>0):
                                obtenerCoordenadasWeb = data[0]
                                row['LATITUD'] = obtenerCoordenadasWeb['lat']
                                row['LONGITUD'] = obtenerCoordenadasWeb['lon'] 
                                self.insertarRegistro(row,i)
                            else:
                                error = "NO SE PUDO GEOLOCALIZAR"
                                self.insertarError(row,error,i)
                    else:
                        repetidos = repetidos + 1
                else:
                    error = "DATOS INCOMPLETOS"
                    self.insertarError(row,error,i)  
            print('Hay repetidos: ' + str(repetidos))
    
class filterbyParams (viewsets.ViewSet):
    serializer_class = AddressSerializer
    def search(self, request, codigo_postal='null', calle='null', altura='null'):
        response = []        
        if(calle != 'null') and (altura != 'null') and (codigo_postal != 'null'):
            row = {
                    'CALLE_45_D1' : calle,
                    'PUERTA_5_D1' : altura,
                    'CP_8_D1' : codigo_postal,
                    'LATITUD' : '',
                    'LONGITUD' : '',
                    'PARTIDA':'',
                    'NOMENCLATURA_CAT':''
                }
            row = syncAPIViewSet.normalizarDireccion(row)
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
                #Aca podemos buscar en el de Marcelo
                toSearch = 'C=' + str(row['CALLE_45_D1']) + '&A=' + str(row['PUERTA_5_D1']) + '&P=' + str(row['CP_8_D1'])
                data = syncAPIViewSet.obtenerDatosAPI('http://128.0.203.119/intranet/geo/cuimCalles.php?'+toSearch)
                latitud = data['lat']
                longitud = data['lng']
                if (latitud != '') and (longitud != ''):
                    row['LATITUD'] = latitud
                    row['LONGITUD'] = longitud
                    syncAPIViewSet.insertarRegistro(row,'A')
                    buscar = Address.objects.filter(codigo_postal = codigo_postal.upper(), calle = calle.upper(), altura = altura).first()
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
                    #Buscamos en el JSON de Codigos Postales, el CP correspondiente y devolvemos la ciudad para poder geolocalizar.
                    ciudad = syncAPIViewSet.obtenerCiudad(row['CP_8_D1'])
                    print (ciudad)
                    toSearch = str(row['CALLE_45_D1']) + "+" + str(row['PUERTA_5_D1']) + "+" + str(ciudad)
                    data = syncAPIViewSet.obtenerDatosAPI('https://nominatim.openstreetmap.org/search.php?q='+toSearch+'&format=json')
                    if(len(data)>0):
                        obtenerCoordenadasWeb = data[0]
                        row['LATITUD'] = obtenerCoordenadasWeb['lat']
                        row['LONGITUD'] = obtenerCoordenadasWeb['lon'] 
                        syncAPIViewSet.insertarRegistro(row,'A')
                        buscar = Address.objects.filter(codigo_postal = codigo_postal.upper(), calle = calle.upper(), altura = altura).first()
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
                        error = "NO SE PUDO GEOLOCALIZAR"
                        syncAPIViewSet.insertarError(row,error,'A')
                        response = {
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

    def listUniqueAddressNames(self,request):
        addressnames = []
        query = Address.objects.all().values('calle','codigo_postal').annotate(count=Count('id')).order_by('-count').filter(count__gt=1)
        for i in range(0,50):
            addressnames.append(query[i])
        if(len(addressnames)>0):
            response = {
                    'code': 200,
                    'succcess' : True,
                    'data' : addressnames
                }
        else:
            response = {
                    'code': 404,
                    'succcess' : False,
                    'error' : "No se encontraron calles."
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
        
class OficiosViewSet(viewsets.ViewSet):
    def registerOficio(self,request):
        res = {}
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        response = filterbyParams.search(filterbyParams,'',body['codigo_postal'],body['calle'],body['altura'])
        if response.data['code'] == 200 :
            data = response.data['data']
            buscarOficioDuplicado = Oficios.objects.filter(calle=body['calle']).filter(altura=body['altura']).filter(detalle=body['detalle'])
            if(buscarOficioDuplicado.count()<1):
                try:
                    nuevo_oficio = Oficios(fecha = body['fecha'],tipo = 'OFICIO',detalle=body['detalle'],calle=body['calle'],altura=body['altura'],estado='CREADO',id_hoja_ruta = -1,latitud = data['LATITUD'], longitud = data['LONGITUD'])
                    nuevo_oficio.save()
                    print("Oficio insertado")  
                    res = {
                        'code': 200,
                        'succcess' : True,
                        'msg' : "Oficio cargado con éxito."
                    }  
                except (Exception, psycopg2.Error) as error:
                    print("Error al insertar el oficio:", error)
                    res = {
                        'code': 401,
                        'succcess' : False,
                        'error' : "Error al insertar. Error: "+str(error)
                    }
        else:
            res = {
                'code': 401,
                'succcess' : False,
                'error' : "Direccion no se puede geolocalizar."
            }
        return Response(data=res, status=res.get('code'))
    
    def list(self, request):    
        elms = []
        buscar = Oficios.objects.filter(id_hoja_ruta=-1).values('id','fecha','tipo','detalle','calle','altura','estado','latitud','longitud')
        if(buscar.count()>0): #Tenemos registros que mostrar, los tenemos que recorrer.
            for i in buscar:
                obj = {
                    'ID' :i['id'],
                    'CODIGO_POSTAL' : '8000',
                    'CALLE' :i['calle'],
                    'ALTURA' :i['altura'],
                    'LATITUD' :i['latitud'],
                    'LONGITUD' :i['longitud'],
                    'TIPO' :i['tipo'],
                    'DETALLE' :i['detalle']
                }
                elms.append(obj)
            res = {
                'code': 200,
                'succcess' : True,
                'data' : elms
            }
        else:
            res = {
                'code': 203,
                'succcess' : False,
                'message' : 'NO SE ENCONTRARON OFICIOS SIN ASIGNAR.',
                'data' : []
            }
        return Response(data=res, status=res.get('code'))