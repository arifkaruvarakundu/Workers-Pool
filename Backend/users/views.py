from django.shortcuts import render
from rest_framework import generics
from authentication.models import User
from authentication.serializers import UserSerializers
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserDetailsSerializer,WorkerSerializer
from rest_framework.views import APIView
from services.models import Services 
from .models import UserDetails


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers

class UserDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserDetails.objects.all()
    serializer_class = UserDetailsSerializer

    def retrieve(self, request, *args, **kwargs):
        user_id = kwargs.get('pk')  # Assuming your URL pattern includes 'pk' as the user_id
        try:
            queryset = UserDetails.objects.get(user_id=user_id)
            serializer = self.get_serializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


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

  
class UserDetailsCreateView(APIView):
    def post(self, request):
        services_ids = request.data.get('services', '').split(',')
        services_ids = [int(sid) for sid in services_ids if sid.isdigit()]

        if services_ids:
            services = Services.objects.filter(id__in=services_ids)
        else:
            services = Services.objects.none()

        mutable_data = request.data.copy()

        user_id = mutable_data.get('user_id')

        try:
            user_instance = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User with the given user_id does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

        mutable_data['user_id'] = user_instance 

        serializer = UserDetailsSerializer(data=mutable_data)

        if serializer.is_valid():
            user_details = serializer.save()

            user_details.services.set(services)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class WorkersByServiceView(APIView):
    def get(self, request, service_id):
        try:
            
            service = Services.objects.get(id=service_id)

            workers = UserDetails.objects.filter(services=service)

            serialized_workers = []

            for worker in workers:
                serialized_worker = UserDetailsSerializer(worker).data
                serialized_workers.append(serialized_worker)
                

            

            return Response(serialized_workers, status=status.HTTP_200_OK)
        except Services.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WorkerDetail(generics.GenericAPIView):
    serializer_class = UserDetailsSerializer

    def get(self, request, pk):
        try:
            worker = UserDetails.objects.get(user_id=pk)
            serialized_worker = UserDetailsSerializer(worker)
            
            return Response(serialized_worker.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response({"error": "Worker not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    