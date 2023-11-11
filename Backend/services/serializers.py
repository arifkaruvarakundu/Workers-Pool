from rest_framework import serializers
from .models import *
from authentication.serializers import UserSerializers

class ServiceSerializers(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'
        ordering = ['id']  

class AppointmentSerializer(serializers.ModelSerializer):
    service = ServiceSerializers()
    customer = UserSerializers()

    class Meta:
        model = Appointment
        fields = '__all__'

            

    

