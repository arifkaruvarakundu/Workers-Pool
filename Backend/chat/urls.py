from django.urls import path
from . import views

urlpatterns = [
      path('', views.getRoutes),
      path('create/',views.MessageCreateView.as_view(),name='message-create'),
      path('chat/<int:user_id>/<int:worker_id>/', views.UserWorkerChatView.as_view(), name='user-worker-chat'),
      path('worker-chat/<int:id>/',views.WorkerChatView.as_view(), name='worker-chat'),
      path('get-user-data/<int:id>/', views.GetUserData.as_view(), name='get-user-data'),
]