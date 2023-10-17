from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import  LogoutView, RegisterView,AccessTokenValidationView,CustomTokenObtainPairView,CSRFTokenView


urlpatterns = [
    path('signup/',RegisterView.as_view()) ,
    path('logout/', LogoutView.as_view()) ,
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token_validation/', AccessTokenValidationView.as_view(), name='token_obtain_pair'),
    path('token/refresh/',jwt_views.TokenRefreshView.as_view(),name ='token_refresh'),
    path('get-csrf-token/', CSRFTokenView.as_view(), name='get_csrf_token'),
]