from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework import serializers
from .models import  User

class UserSerializers(serializers.ModelSerializer): 
    
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
class PasswordUpdateSerializer(serializers.Serializer):
    new_password = serializers.CharField()
class CSRFTokenSerializer(serializers.Serializer):
    csrfToken = serializers.CharField()