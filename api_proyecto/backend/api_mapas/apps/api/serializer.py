from rest_framework import serializers
from .models import Address, Oficios

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        
class OficiosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficios
        fields = '__all__'