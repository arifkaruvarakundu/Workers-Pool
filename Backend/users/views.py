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
    queryset = User.objects.all().order_by('username')
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

  
# class UserDetailsCreateView(APIView):
#     def post(self, request):
#         print("^^^^^^^^$$$$$$$$$$$$",request.data)
#         services_ids = request.data.get('services', '').split(',')
#         services_ids = [int(sid) for sid in services_ids if sid.isdigit()]

#         if services_ids:
#             services = Services.objects.filter(id__in=services_ids)
#         else:
#             services = Services.objects.none()

#         mutable_data = request.data.copy()

#         user_id = mutable_data.get('user_id')

#         try:
#             user_instance = User.objects.get(id=user_id)
#         except User.DoesNotExist:
#             return Response({'error': 'User with the given user_id does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

#         mutable_data['user_id'] = user_instance 

#         serializer = UserDetailsSerializer(data=mutable_data)
#         print("$$$$$$####################",serializer)
#         if serializer.is_valid():
#             user_details = serializer.save()

#             user_details.services.set(services)

#             return Response(serializer.data, status=status.HTTP_201_CREATED)

        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsCreateView(APIView):
    def post(self, request):
        print("^^^^^^^^$$$$$$$$$$$$", request.data)
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

        # Create UserDetails instance without using a serializer
        user_details = UserDetails.objects.create(
            user_id=user_instance,
            # Add other fields here based on your model
            first_name=mutable_data.get('first_name'),
            last_name=mutable_data.get('last_name'),
            mobile_number=mutable_data.get('mobile_number'),
            street_name=mutable_data.get('street_name'),
            house_number=mutable_data.get('house_number'),
            ward=mutable_data.get('ward'),
            panchayath_municipality_corporation=mutable_data.get('panchayath_municipality_corporation'),
            taluk=mutable_data.get('taluk'),
            district=mutable_data.get('district'),
            state=mutable_data.get('state'),
            country=mutable_data.get('country'),
            # Add other fields as needed
        )

        # Associate services with the created user_details
        user_details.services.set(services)

        return Response({'success': 'User details created successfully'}, status=status.HTTP_201_CREATED)

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
    

from django.views import View
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from Admin.models import AdminWallet
from .models import UserWallet

class TransferCreditView(View):
    def get(self, request, customerId, *args, **kwargs):
        # Assuming 'admin_id' is constant (e.g., 1)
        admin_id = 1
        admin_wallet = get_object_or_404(AdminWallet, user_id=admin_id)

        # Find the UserWallet corresponding to the given user_id
        user_wallet, created = UserWallet.objects.get_or_create(user_id=customerId, defaults={'balance': 0.0})

        # Transfer Rs.50 from AdminWallet to UserWallet
        transfer_amount = 50
        if admin_wallet.balance >= transfer_amount:
            admin_wallet.balance -= transfer_amount
            admin_wallet.debit += transfer_amount
            admin_wallet.save()

            user_wallet.balance += transfer_amount
            user_wallet.save()

            return JsonResponse({'success': True, 'message': f'Rs. {transfer_amount} credited to UserWallet successfully.'})
        else:
            return JsonResponse({'success': False, 'message': 'Insufficient balance in AdminWallet.'}, status=400)


from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import UserWallet

@method_decorator(csrf_exempt, name='dispatch')  # Use csrf_exempt for simplicity. Consider using a token-based approach for production.
class UserWalletDetailsView(View):
    def get(self, request, user_id):
        user_wallet = get_object_or_404(UserWallet, user_id=user_id)

        # Prepare data to send to the frontend
        wallet_details = {
            'user': {
                'username': user_wallet.user.username,
            },
            'balance': user_wallet.balance,
            'created_at': user_wallet.created_at,
            'credit': user_wallet.credit,
            'debit': user_wallet.debit,
        }

        return JsonResponse(wallet_details)
    

class TransferCreditBackView(APIView):
    @csrf_exempt
    def put(self, request, user_id):
        try:
            admin_id = 1
            user_wallet = get_object_or_404(UserWallet, user_id=user_id)
            admin_wallet = get_object_or_404(AdminWallet, user_id=admin_id)
            transfer_amount = 50
            if user_wallet.balance >= transfer_amount:
                user_wallet.balance -= transfer_amount
                user_wallet.debit += transfer_amount
                user_wallet.save()

                admin_wallet.balance += transfer_amount
                admin_wallet.credit += transfer_amount
                admin_wallet.save()

                return JsonResponse({'success': True, 'message': f'Rs. {transfer_amount} transferred to AdminWallet successfully.'})
            else:
                return JsonResponse({'success': False, 'message': 'Insufficient balance in UserWallet.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .models import UserDetails

class CheckUserDetailsView(APIView):
    def get(self, request, user_id):
        try:
            user_details = UserDetails.objects.get(user_id=user_id)
            # UserDetails object exists for the user
            return Response({'userDetailsCreated': True}, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            # UserDetails object does not exist for the user
            return Response({'userDetailsCreated': False}, status=status.HTTP_200_OK)
