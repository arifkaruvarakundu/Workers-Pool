from django.urls import path
from .views import  UserList,UserDetail,BlockUnblockView


urlpatterns = [
    path('users/',UserList.as_view()),
    path('userdetails/', UserDetail.as_view()),
    path('user/<int:pk>/block_unblock/', BlockUnblockView.as_view(), name='block-unblock-user'),
    
]