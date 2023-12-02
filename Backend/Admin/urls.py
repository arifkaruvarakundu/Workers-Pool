from django.urls import path
from .views import *


urlpatterns = [
    path('dashboard/',DashBoardView.as_view()) ,
   
]