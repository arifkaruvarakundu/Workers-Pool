from datetime import datetime
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

class All_Appointment(APIView):
    serializer_class = AppointmentSerializer
    permission_classes = IsAuthenticated, IsAdminUser

    def get(self, request):
        q = Appointment.objects.all()
        serializer = self.serializer_class(q, many=True).data
        return Response(serializer,status=status.HTTP_200_OK)

class Assign_book_status(APIView):
    serializer_class = AppointmentSerializer
    permission_classes = IsAuthenticated, IsAdminUser

    def post(self, request):
        appointment_id = request.data.get("apt_id")
        status = request.data.get('status')
        appointment = Appointment.objects.get(id=appointment_id)
        appointment.status = status
        appointment.save()

        return Response({"message": "Appointment status changed successfully"}, status=status.HTTP_200_OK)
    

from rest_framework import status as http_status

from rest_framework import status as http_status

class Book_appointment(APIView):
    status_mapping = {
        "waiting_for_payment": http_status.HTTP_201_CREATED,
        "Pending": http_status.HTTP_200_OK,
        "Accept": http_status.HTTP_202_ACCEPTED,
    }

    def post(self, request):
        customer_id = request.data.get('user_id')
        customer = User.objects.get(id=customer_id)
        print("#########@@@@@@@@@@@@@^^^^^", customer)
        service_id = request.data.get("serviceId")
        service = Services.objects.get(id=service_id)
        print("#########@@@@@@@@@@@@@^^^^^", service)
        short_description = request.data.get('short_description')
        date_str = request.data.get('selectedDate')
        status_str = request.data.get('status', "waiting_for_payment")

        try:
            date = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ").date()
        except ValueError:
            return Response(
                {"date1": ["Invalid date format. Use YYYY-MM-DDTHH:mm:ss.SSSZ format."]},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        # Ensure that the provided status_str is a valid choice
        if status_str not in [choice[0] for choice in Appointment._meta.get_field('status').choices]:
            return Response(
                {"status": ["Invalid value for 'status'."]},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        # Use the status value from the model choices
        status = self.status_mapping[status_str]

        appointment = Appointment.objects.create(
            service=service,
            customer=customer,
            status=status_str,
            short_description=short_description,
            date1=date,
        )

        print("%$$$$$$$$$********", appointment)

        return Response({"message": "Appointment created successfully"}, status=status)










# class CheckoutView(View):  
#     def post(self, request, *args, **kwargs):
#         print("%$$$$$$$$$$$&&&&&&&&&&&&")
       
#         checkout_session = stripe.checkout.Session.create(
#             line_items=[
#                 {
#                     "price": "price_1OA5lNSIwD41cwvpQQ5acn1O",
#                     "quantity": 1,
#                 },
#             ],
#             mode="payment",
#             success_url='http://localhost:5173/payment_successful',
#             cancel_url='http://localhost:5173/payment_cancelled',
#         )
#         return redirect(checkout_session.url, code=303)


# class TestPaymentView(APIView):
#     def post(self, request, *args, **kwargs):
#         # Your view logic here
#         test_payment_intent = stripe.PaymentIntent.create(
#             amount=1000, currency='pln',
#             payment_method_types=['card'],
#             receipt_email='test@example.com'
#         )

#         return Response({'client_secret': test_payment_intent.client_secret}, status=status.HTTP_200_OK)


class delete_appointment(APIView):

    permission_classes = [IsAuthenticated, ]
    
    def post(self, request):
        user = User.objects.get(username=request.user)
        customer =User.objects.get(user=user).id
        apt_id = request.data.get('id')
        apt = Appointment.objects.filter(customer=customer, id=apt_id)
        if apt_id:
            if apt.exists():
                data = Appointment.objects.get(id=apt_id)
                data.delete()
                return Response({"message": "Appointment delete successful"},status=status.HTTP_200_OK)
            else:
                return Response({"message": "You can not delete this appointment"},status=status.HTTP_400_BAD_REQUEST)



class StripeCheckoutView(APIView):
    def post(self, request):
        # userId = request.data.get("userId")
        # user = User.objects.get(pk=userId)
        # Name_of_User = user.first_name
        # driver = request.data.get("driver")
        # tripId = request.data.get("tripId")
        # Trip = TripRequest.objects.get(pk=tripId)
        # Total_fare = Trip.total_fare
        # print('requests strip checking')
        try:
            stripe.api_key = settings.STRIPE_SECRET_KEY
            # Ensure that course.price is an integer representing the price in cents.
            # pricess = int(Total_fare* 100)            
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
                    # 'userId': userId,
                    # 'driver': driver,
                    # 'tripId': tripId,
                    # 'amount' : Total_fare,
                                    },
                
                 success_url=settings.BASE_URL + '/?success=true',
                 cancel_url=settings.BASE_URL + '/?canceled=true'
            )
            return Response({'url': checkout_session.url, 'session_id': checkout_session.id}, status=status.HTTP_200_OK)

        except stripe.error.StripeError as e:
            # Handle Stripe-specific errors
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

# @csrf_exempt
# def stripe_webhook_view(request):

#     send_mail(
#                     'OTP Verification',
#                     f'Your OTP is: here',
#                     'your_email@example.com',  # Replace with your email address
#                     ['sudheesh448@gmail.com'],
#                     fail_silently=False,
#                 )

#     payload = request.body
#     endpoint_secret = 'whsec_7xjf2G4xsowxk3MAVTq5k7Xy1FWqQJSR'
#     sig_header = request.META['HTTP_STRIPE_SIGNATURE']
#     event = None

#     try:
#         event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
#     except ValueError as e:
#         # Invalid payload
#         return HttpResponse(status=400)
#     except stripe.error.SignatureVerificationError as e:
#         # Invalid signature
#         return HttpResponse(status=400)

#     if event['type'] == 'checkout.session.completed':
#         session = stripe.checkout.Session.retrieve(
#         event['data']['object']['id'],
#         expand=['line_items'],
#         )
#         # print("session",session)
#         metadata = session.metadata
#         tripId = metadata.get('tripId')
#         driver = metadata.get('driver')
#         userId = metadata.get('userId')
#         amount = metadata.get('amount')

#         # Access payment information
#         # Access payment information using line_items
#         line_items = session.line_items
#         payment_id = line_items.data[0]['id']
#         payment_status = session.payment_status

#         print("tripId:", tripId)
#         print("driver:", driver)
#         print("userId:", userId)
#         print("Payment ID:", payment_id)
#         print("Payment Status:", payment_status)
#         print("amount",amount)

#         payment = Payment.objects.create(
#         trip=TripRequest.objects.get(pk=tripId),
#         amount=amount,
#         date_time=timezone.now(),  # You may need to import timezone
#         user=User.objects.get(pk=userId),
#         driver=driver,
#         payment_status=payment_status,
#         payment_id=payment_id
#     )
        
        
#         print("payment table entered")
#     # Update the TripRequest with the payment information
        

#         driver_user = User.objects.get(username=driver)
#         driver_wallet, created = Wallet.objects.get_or_create(user=driver_user)

#         # Create a transaction to debit the driver's wallet
#         if payment_status == 'paid':
#                 commission = 0.03 * float(amount)
#                 transaction = Transaction.objects.create(
#                 wallet=driver_wallet,
#                 user=User.objects.get(pk=userId),
#                 credit=float(amount)-commission,
#                 actual_fare=float(amount),  # Update this based on your business logic
#                 commission=commission,  # Set commission to 0 if there's no commission
#                 trip=TripRequest.objects.get(pk=tripId)
#                 )

#                 print("transaction table entered")
#                 trip_request = get_object_or_404(TripRequest, pk=tripId)
#                 trip_request.payment_status = "Paid"
#                 trip_request.payment_method = "stripe"
#                 trip_request.payment_id = payment_id
#                 trip_request.save()
#                 print("trip request table updated")

#                 tripdriver = RequestDriver.objects.get(trip_id=tripId)
#                 tripdriver.payment_status="Paid"
#                 tripdriver.save()

#                 # Update the wallet balance
                
#                 # Calculate the amount to be credited to the driver's wallet (97% of the amount)
#                 credit_amount = float(amount) - commission
#                 # Update the driver's wallet balance with the credit amount
#                 driver_wallet.balance += credit_amount
#                 driver_wallet.save()
#                 print("driver wallete updated")

#                 commission_transaction = DriversClubWallet.objects.create(
#                 credit=commission,  # Credit the commission amount
#                 trip=TripRequest.objects.get(pk=tripId),  # Associate the transaction with the trip (if applicable)
#             )
#                 print("Admin wallete updated")
#     return HttpResponse(status=200)