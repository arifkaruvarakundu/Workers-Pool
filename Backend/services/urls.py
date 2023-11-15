from django import views
from django import urls
from django.urls import path
from .views import *


urlpatterns = [
    path('services/', ServiceListView.as_view()),
    path('add_service/', CreateService.as_view()),
    path('delete_services/<int:service_id>/', DeleteService.as_view()),
    path('assign_appointment_status', Assign_book_status.as_view(), name='assign-appointment-status'),
    path('view_new_appointment', View_New_Appointment.as_view(), name='view-new-appointment'),
    path('view_confirm_appointment', View_Confirm_Appointment.as_view(), name='view-confirm-appointment'),
    path('all_appointment/', All_Appointment.as_view(), name='all-appointment'),
    path('book_appointment', Book_appointment.as_view(), name='book-appointment'),
    path('delete_appointment/<int:id>/', DeleteAppointment.as_view(), name='delete-appointment'),
    path('checkout/', StripeCheckoutView.as_view(), name='checkout'),
    path('webhooks',MyWebhookView.as_view())

    
]