from django.urls import path
from .views import  *

urlpatterns = [
    path('users/',UserList.as_view()),  
    path('userdetails/<int:pk>/', UserDetailsView.as_view(), name='user-details'),
    path('user/<int:pk>/block_unblock/', BlockUnblockView.as_view(), name='block-unblock-user'),
    path('add_details/', UserDetailsCreateView.as_view(), name='user-details-create'),
    path('service/<int:service_id>/workers/', WorkersByServiceView.as_view(), name='workers_by_service'),
    path('worker/<int:pk>/', WorkerDetail.as_view(), name='worker-detail'),
    path('transfer_credit/<int:customerId>/', TransferCreditView.as_view(), name='transfer_credit'),
    path('user_wallet_details/<int:user_id>/', UserWalletDetailsView.as_view(), name='user_wallet_details'),
    path('transfer_credit_back/<int:user_id>/', TransferCreditBackView.as_view(), name='transfer_credit_back'),
    path('check_user_details/<int:user_id>/', CheckUserDetailsView.as_view(), name='check_user_details'),   
]    