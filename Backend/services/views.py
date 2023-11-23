from datetime import datetime
from django.utils import timezone as django_timezone
from django.shortcuts import redirect
from django.views import View
from rest_framework.generics import ListAPIView
from .models import Services
from .serializers import ServiceSerializers
from rest_framework import status
from rest_framework.response import Response
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated,IsAdminUser
import stripe
from django.conf import settings

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

class View_New_Appointment(APIView):
    serializer_class = AppointmentSerializer
    permission_classes = IsAuthenticated, IsAdminUser

    def get(self, request):
        q = Appointment.objects.filter(status="Pending")
        serializer = self.serializer_class(q, many=True).data
        return Response(serializer, status=status.HTTP_200_OK)

class View_Confirm_Appointment(APIView):
    serializer_class = AppointmentSerializer
    permission_classes = IsAuthenticated, IsAdminUser

    def get(self, request):
        q = Appointment.objects.filter(status="Accept")
        serializer = self.serializer_class(q, many=True).data
        return Response(serializer,status=status.HTTP_200_OK)


class All_Appointment_worker(APIView):
    serializer_class = AppointmentSerializer

    def get(self, request, id):
        try:
            user_id = int(id)
        except ValueError:
            return Response({"error": "Invalid user_id"}, status=status.HTTP_400_BAD_REQUEST)
        

        q = Appointment.objects.filter(worker_id=user_id)
        serializer = self.serializer_class(q, many=True).data
        return Response(serializer, status=status.HTTP_200_OK)
    

class All_Appointment_user(APIView):
    serializer_class = AppointmentSerializer

    def get(self, request, id):
        try:
            user_id = int(id)
        except ValueError:
            return Response({"error": "Invalid user_id"}, status=status.HTTP_400_BAD_REQUEST)
        

        q = Appointment.objects.filter(customer_id=user_id)
        serializer = self.serializer_class(q, many=True).data
        return Response(serializer, status=status.HTTP_200_OK)
    

class All_Appointment(APIView):
    serializer_class = AppointmentSerializer

    def get(self, request):
        q = Appointment.objects.all()
        serializer = self.serializer_class(q, many=True).data
        return Response(serializer, status=status.HTTP_200_OK)


class Assign_book_status(APIView):
    serializer_class = AppointmentSerializer

    def put(self, request, id):
        appointment_id = int(id)
        status_value = request.data.get('status')

        try:
            appointment = Appointment.objects.get(id=appointment_id)
            appointment.status = status_value 
            appointment.save()

            return Response({"message": "Appointment status changed successfully"}, status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework import status as http_status

class Book_appointment(APIView):
    status_mapping = {
        "Pending": http_status.HTTP_200_OK,
        "Accepted": http_status.HTTP_202_ACCEPTED,
        "Rejected": http_status.HTTP_203_NON_AUTHORITATIVE_INFORMATION,
        "Cancelled": http_status.HTTP_204_NO_CONTENT
    }

    def post(self, request):
        customer_id = request.data.get('user_id')
        customer = User.objects.get(id=customer_id)
        worker_id=request.data.get('workerId')
        worker=User.objects.get(id=worker_id)
        service_id = request.data.get("serviceId")
        service = Services.objects.get(id=service_id)
        short_description = request.data.get('short_description')
        date = request.data.get('selectedDate')
        status_str = request.data.get('status', "Pending")
        
        if status_str not in [choice[0] for choice in Appointment._meta.get_field('status').choices]:
            return Response(
                {"status": ["Invalid value for 'status'."]},
                status=http_status.HTTP_400_BAD_REQUEST
            )
            
        appointment = Appointment.objects.create(
            service=service,
            customer=customer,
            worker=worker,
            status=status_str,
            short_description=short_description,
            date1=date,
        )

        response_data = {
            "message": "Appointment created successfully",
            "appointment_id": appointment.id,  
        }

        status = self.status_mapping[status_str]

        return Response(response_data, status=status)

class AppointmentStatusView(APIView):
    def get(self, request, appointment_id):
        try:
            
            appointment = Appointment.objects.get(pk=appointment_id)

            
            appointment_status = appointment.status

            return Response({'status': appointment_status}, status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AppointmentStatusChoices(APIView):
    def get(self, request):
        choices = Appointment.get_status_choices()
        return Response(choices, status=status.HTTP_200_OK)


from django.shortcuts import get_object_or_404
class DeleteAppointment(APIView):
    def put(self, request, id):
        appointment = get_object_or_404(Appointment,id=id)

        if appointment:
            appointment.delete()
            return Response({"message": "Appointment delete successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "You can not delete this appointment"}, status=status.HTTP_400_BAD_REQUEST)

class StripeCheckoutView(APIView):
    def post(self, request):
        userId = request.data.get("user_id")
        user = User.objects.get(pk=userId)
        Name_of_User = user.first_name
        worker_username = request.data.get("workerUsername")
        appointment_id = request.data.get("appointment_id")
        appointment=Appointment.objects.get(id=appointment_id)
        payment_status=appointment.is_paid


        
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            
            appointment = Appointment.objects.get(pk=appointment_id)
            appointment.status = 'pending'
            appointment.is_paid='True'
            appointment.save()

            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "price": "price_1OA5lNSIwD41cwvpQQ5acn1O",
                        "quantity": 1,
                        
                    },
                ],

                payment_method_types=['card'],
                mode='payment',
                metadata = {
                    'userId': userId,
                    'worker': worker_username,
                    'appointmentId': appointment_id,
                    'amount' : "RS:50/-",
                    'payment_status':'True',
                                    },
                
                
                 success_url=settings.BASE_URL + '/?success=true',
                 cancel_url=settings.BASE_URL + '/?canceled=true'
            )
            return Response({'url': checkout_session.url, 'session_id': checkout_session.id}, status=status.HTTP_200_OK)

        except stripe.error.StripeError as e:
           
            print(f"Stripe Error: {e}")
            return Response(
                {
                    'error': 'Something went wrong when creating the Stripe checkout session'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            # Handle other exceptions
            print(f"An error occurred: {e}")
            return Response(
                {
                    'error': 'An error occurred while processing the request'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

stripe.api_key =settings.STRIPE_SECRET_KEY

from django.http import HttpResponse

endpoint_secret = 'whsec_b1ffc4de05fcba503ac51c7633aa3a4fa3481f708054ed6bb22975d1d8416eda'
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class MyWebhookView(View):
    def post(self, request, *args, **kwargs):
        payload = request.body
        
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
         
            print('Error parsing payload: {}'.format(str(e)))
            return HttpResponse(status=400)
        except stripe.error.SignatureVerificationError as e:
            
            print('Error verifying webhook signature: {}'.format(str(e)))
            return HttpResponse(status=400)

      
        if event.type == 'checkout.session.completed':
            session = stripe.checkout.Session.retrieve(
                        event['data']['object']['id'],
                        expand=['line_items'],
                        )
            

            metadata = session.metadata
            payment_status = metadata.get('payment_status')
            worker = metadata.get('worker')
            appointmentId=metadata.get('appointmentId')
            userId = metadata.get('userId')
            amount = metadata.get('amount')

            # Access payment information
            # Access payment information using line_items
            line_items = session.line_items
            payment_id = line_items.data[0]['id']
            payment_status = session.payment_status


            payment = Payment.objects.create(
            appointment=Appointment.objects.get(pk=appointmentId),
            amount=amount,
            date_time = django_timezone.now(),  # You may need to import timezone
            user=User.objects.get(pk=userId),
            worker=worker,
            payment_status=payment_status,
            payment_id=payment_id
        )
            
            print('PaymentIntent was successful!')
            
        return HttpResponse(status=200)
    

from django.http import JsonResponse


class GetBusyDatesView(View):
    def get(self, request, worker_id):
        try:
            busy_dates = Appointment.objects.filter(worker_id=worker_id, status='Accepted').values_list('date1', flat=True)
            # Convert busy dates to a list of strings in ISO format
            busy_dates_iso = [str(date) for date in busy_dates]
            return JsonResponse({'busyDates': busy_dates_iso})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
