from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import ChangePasswordSerializer, UserSerializers
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User 
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializers
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
import random
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate


class RegisterView(APIView):
    def post(self, request):
        
        if User.objects.filter(username=request.data['username']).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        
        role = request.data.get('role', 'user')

        
        registration_data = {
            'username': request.data['username'],
            'email': request.data['email'],
            'password': request.data['password'],
            'role': role,
        }

       
        registration_data['is_active'] = False

        
        serializer = UserSerializers(data=registration_data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data.get('username')
        email = serializer.validated_data.get('email')

        if serializer.is_valid():
            user = serializer.save()
            request.session['registration_data'] = serializer.validated_data

            
            otp = get_random_string(length=6, allowed_chars='1234567890')
            expiry = datetime.now() + timedelta(minutes=5)  
            request.session['otp'] = otp
            print(request.session['otp'])
            request.session['otp_expiry'] = expiry.strftime('%Y-%m-%d %H:%M:%S')
            email = user.email

            
            send_mail(
                'OTP Verification',
                f'Your OTP is: {otp}',
                'nedungadanharif@gmail.com',  
                [email],
                fail_silently=False,
            )

            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
            
        else:
            return Response({'error': 'Data validation failed. Please check your input.'}, status=status.HTTP_400_BAD_REQUEST)


class UserRegOTPVerificationView(APIView):
    def post(self, request):
        
        entered_otp = request.data.get('otp')
        

       
        stored_otp = request.session.get('otp')
        

        if entered_otp == stored_otp:
            
            registration_data = request.session.get('registration_data')
            email = registration_data['email']
            password = registration_data['password']
            username = registration_data['username']

            

            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            user.is_active = True
            user.save()

            
            del request.session['otp']
            del request.session['registration_data']

            return Response({'message': 'Registration successful'})
        else:
            
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)



class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        refresh = RefreshToken.for_user(user)
        access_token = str(response.data['access'])

       
        is_superuser = user.is_superuser

        
        if is_superuser:
            user_role = 'admin'
        else:
            user_role = user.role  

        response.data['admin'] = is_superuser
        response.data['username'] = user.username
        response.data['id'] = user.id
        response.data['access_token'] = access_token
        response.data['user_role'] = user_role  

        return response
    

class LogoutView(APIView):
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Error:", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
    
       
class AccessTokenValidationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        
        
        return Response({'message': 'Access token is valid'}, status=status.HTTP_200_OK)




class ProfilePictureUpload(APIView):
    def post(self, request, format=None):
        prof_id=request.data['user_id']
        profile = User.objects.get(id=prof_id)
        profile.profile_img = request.data['profile_image']
        profile.save()
        return Response(status=status.HTTP_201_CREATED)
    

# from django.contrib.auth import update_session_auth_hash
# from django.http import JsonResponse
# from django.views import View

# class ChangePasswordView(View):
    
#     def post(self, request):
#         print("+++++++++++------------------+++++++++++++++++**********")
#         old_password = request.data.get('old_password')
#         new_password = request.data.get('new_password')

#         if request.user.check_password(old_password):
#             request.user.set_password(new_password)
#             request.user.save()
#             update_session_auth_hash(request)  # To prevent users from being logged out.

#             return JsonResponse({'message': 'Password changed successfully'})
#         else:
#             return JsonResponse({'error': 'Incorrect old password'}, status=400)
        

from rest_framework.generics import UpdateAPIView

class ChangePasswordView(UpdateAPIView):
        """
        An endpoint for changing password.
        """
        serializer_class = ChangePasswordSerializer
        model = User
        # permission_classes = (IsAuthenticated,)

        def get_object(self, queryset=None):
            obj = self.request.data.user['id']
            return obj

        def update(self, request, *args, **kwargs):
            self.object = self.get_object()
            serializer = self.get_serializer(data=request.data)

            if serializer.is_valid():
                # Check old password
                if not self.object.check_password(serializer.data.get("old_password")):
                    return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
                # set_password also hashes the password that the user will get
                self.object.set_password(serializer.data.get("new_password"))
                self.object.save()
                response = {
                    'status': 'success',
                    'code': status.HTTP_200_OK,
                    'message': 'Password updated successfully',
                    'data': []
                }

                return Response(response)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





        
