from rest_framework import serializers
from .models import UserDetails
from services.serializers import ServiceSerializers
from authentication.serializers import UserSerializers



class UserDetailsSerializer(serializers.ModelSerializer):
    services = ServiceSerializers(many=True, read_only=True)
    user_id=UserSerializers(read_only=True)


    class Meta:
        model = UserDetails
        fields = '__all__'

    # profile_img = serializers.ImageField(source='user.profile_img', read_only=True)


class WorkerSerializer(serializers.ModelSerializer):
    user_id=UserSerializers(read_only=True)
    class Meta:
        model = UserDetails
        fields = '__all__'

    # profile_img = serializers.ImageField(source='user.profile_img', read_only=True)
