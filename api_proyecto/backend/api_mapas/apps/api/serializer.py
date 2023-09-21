from rest_framework import serializers
from .models import Address, Oficios, HojaDeRuta

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        
class OficiosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficios
        fields = '__all__'
        
class HojaDeRutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HojaDeRuta
        fields = '__all__'