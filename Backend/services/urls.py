from django.urls import path
from .views import  ServiceListView,DeleteService,CreateService


urlpatterns = [
    path('services/', ServiceListView.as_view()),
    path('add_service/', CreateService.as_view()),
    path('delete_services/<int:service_id>/', DeleteService.as_view()),
   
    
]