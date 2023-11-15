# # chat/views.py

from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Message
from .serializers import MessageSerializer
from authentication.models import User
from django.db import models


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'booking/history',
        'booking/create'
    ]
    return Response(routes)

class MessageCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserWorkerChatView(APIView):
    def get(self,request,user_id,worker_id,*args,**kwargs):
        try:
            user=User.objects.get(id=user_id)
            worker=User.objects.get(id=worker_id)
        except User.DoesNotExist:
            return Response({"error":"invalid user or doctor"}, status=status.HTTP_400_BAD_REQUEST)
        # Fetch all messages related to the user and doctor
        messages=Message.objects.filter(
            (models.Q(sender=user)&models.Q(receiver=worker)) |
            (models.Q(sender=worker)&models.Q(receiver=user))

        ).order_by('timestamp')

        serializer=MessageSerializer(messages,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)