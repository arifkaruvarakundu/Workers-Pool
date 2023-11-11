from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import  LogoutView, RegisterView,AccessTokenValidationView,CustomTokenObtainPairView,UserRegOTPVerificationView,ProfilePictureUpload,ChangePasswordView


urlpatterns = [
    path('signup/',RegisterView.as_view()) ,
    path('verify_registration_otp/', UserRegOTPVerificationView.as_view()),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view()) ,
    path('token_validation/', AccessTokenValidationView.as_view(), name='token_obtain_pair'),
    path('token/refresh/',jwt_views.TokenRefreshView.as_view(),name ='token_refresh'),
    path('upload_profile_pic/', ProfilePictureUpload.as_view(), name='upload_profile_pic'),
    path('change_password/', ChangePasswordView.as_view(), name='change_password'),


    
]