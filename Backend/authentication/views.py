from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializers
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User 
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .serializers import UserSerializers
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
import random
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate


class RegisterView(APIView):
    def post(self, request):
        # Check if a user with the same username or email already exists
        if User.objects.filter(username=request.data['username']).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Capture the user's role from the request data
        role = request.data.get('role', 'user')

        # Create a dictionary with user data, including the role
        user_data = {
            'username': request.data['username'],
            'email': request.data['email'],
            'password': request.data['password'],
            'role': role,
        }

        # Serialize and validate the user data
        serializer = UserSerializers(data=user_data)

        if serializer.is_valid():
            user = serializer.save()

            # Generate and send an email verification code (OTP)
            otp = get_random_string(length=6, allowed_chars='1234567890')
            expiry = datetime.now() + timedelta(minutes=5)  # OTP expires in 5 minutes
            request.session['otp'] = otp
            request.session['otp_expiry'] = expiry.strftime('%Y-%m-%d %H:%M:%S')
            email = user.email

            # Send the OTP to the user's email
            send_mail(
                'OTP Verification',
                f'Your OTP is: {otp}',
                'nedungadanharif@gmail.com',  # Replace with your email address
                [email],
                fail_silently=False,
            )

            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Data validation failed. Please check your input.'}, status=status.HTTP_400_BAD_REQUEST)



class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        refresh = RefreshToken.for_user(user)
        access_token = str(response.data['access'])

        # Check if the user is a superuser
        is_superuser = user.is_superuser

        # Set the user's role based on the choices
        if is_superuser:
            user_role = 'admin'
        else:
            user_role = user.role  # Get the user's role from the User model

        response.data['admin'] = is_superuser
        response.data['username'] = user.username
        response.data['id'] = user.id
        response.data['access_token'] = access_token
        response.data['user_role'] = user_role  # Set the user role

        return response



class LogoutView(APIView):
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)

            # Add the token to the blacklist
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Error:", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class AccessTokenValidationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        print("here")
        # If the request reaches this point, the access token is valid
        return Response({'message': 'Access token is valid'}, status=status.HTTP_200_OK)
    


from django.middleware.csrf import get_token
from .serializers import CSRFTokenSerializer

class CSRFTokenView(APIView):
    def get(self, request):
        csrf_token = get_token(request)
        serializer = CSRFTokenSerializer({'csrfToken': csrf_token})
        return Response(serializer.data)



        
