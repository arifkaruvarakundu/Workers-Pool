from django.urls import path
from .views import  UserList,UserDetailsView,BlockUnblockView,UserDetailsCreateView,WorkersByServiceView,WorkerDetail


urlpatterns = [
    path('users/',UserList.as_view()),  
     path('userdetails/<int:pk>/', UserDetailsView.as_view(), name='user-details'),
    path('user/<int:pk>/block_unblock/', BlockUnblockView.as_view(), name='block-unblock-user'),
    path('add_details/', UserDetailsCreateView.as_view(), name='user-details-create'),
    path('service/<int:service_id>/workers/', WorkersByServiceView.as_view(), name='workers_by_service'),
    path('worker/<int:pk>/', WorkerDetail.as_view(), name='worker-detail'),


]