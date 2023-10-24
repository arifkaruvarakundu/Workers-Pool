from django.shortcuts import render
from rest_framework import generics
from authentication.models import User
from authentication.serializers import UserSerializers
from rest_framework.response import Response
from rest_framework import status
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers


class BlockUnblockView(generics.UpdateAPIView):
    queryset=User.objects.all()
    lookup_field = 'pk' 
    def update(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')
        try:
            user = self.get_object()
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Block/unblock the user by setting is_active
        user.is_active = not user.is_active
        user.save()

        return Response({"message": "User blocked/unblocked successfully"}, status=status.HTTP_200_OK)

        