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
from .serializers import PasswordUpdateSerializer
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
        registration_data = {
            'username': request.data['username'],
            'email': request.data['email'],
            'password': request.data['password'],
            'role': role,
        }

        # Add is_active as False
        registration_data['is_active'] = False

        # Serialize and validate the user data
        serializer = UserSerializers(data=registration_data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data.get('username')
        email = serializer.validated_data.get('email')

        if serializer.is_valid():
            user = serializer.save()
            request.session['registration_data'] = serializer.validated_data

            # Generate and send an email verification code (OTP)
            otp = get_random_string(length=6, allowed_chars='1234567890')
            expiry = datetime.now() + timedelta(minutes=5)  # OTP expires in 5 minutes
            request.session['otp'] = otp
            print(request.session['otp'])
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


class UserRegOTPVerificationView(APIView):
    def post(self, request):
        # Extract OTP entered by the user
        entered_otp = request.data.get('otp')
        print(entered_otp)

        # Retrieve the stored OTP from the session
        stored_otp = request.session.get('otp')
        print(stored_otp)

        if entered_otp == stored_otp:
            # OTP is valid, proceed with user registration

            # Extract user registration data from the session or request
            registration_data = request.session.get('registration_data')
            email = registration_data['email']
            password = registration_data['password']
            username = registration_data['username']

            print(registration_data)

            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            # Activate the user
            user.is_active = True
            user.save()

            # Additional fields can be set here, such as first_name, last_name, etc.
            # user.first_name = registration_data['first_name']
            # user.last_name = registration_data['last_name']

            # Save the user
            user.save()

            # Remove OTP and registration data from the session
            del request.session['otp']
            del request.session['registration_data']

            return Response({'message': 'Registration successful'})
        else:
            # OTP is invalid
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)



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
            # token = RefreshToken(refresh_token)

            # Add the token to the blacklist
            # token.blacklist()

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
    


class PasswordUpdateView(APIView):
    def post(self, request):
        serializer = PasswordUpdateSerializer(data=request.data)
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            user = request.user  # You can use the authenticated user here
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





        
