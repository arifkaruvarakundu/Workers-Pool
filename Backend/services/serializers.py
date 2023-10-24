from rest_framework import serializers
from .models import Services

class ServiceSerializers(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'
