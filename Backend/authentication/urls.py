from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt import views as jwt_views
from .views import CustomTokenObtainPairView

urlpatterns = [
    
    path('token/',CustomTokenObtainPairView.as_view(), name ='token_obtain_pair'),
     path('token/refresh/',jwt_views.TokenRefreshView.as_view(), name ='token_refresh')
]


