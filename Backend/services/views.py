from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .models import Services
from .serializers import ServiceSerializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes

@parser_classes([MultiPartParser, FormParser])
class CreateService(APIView):
    def post(self, request):
        serializer = ServiceSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteService(APIView):
    def delete(self, request, service_id):
        try:
            service = Services.objects.get(id=service_id)
        except Services.DoesNotExist:
            raise Http404

        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ServiceListView(ListAPIView):
    queryset = Services.objects.all()
    serializer_class = ServiceSerializers