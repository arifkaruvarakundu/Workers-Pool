from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'wss/chat/(?P<room_name>\d+_\d+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'wss/notification/(?P<room_name>\w+)/$', consumers.NotificationConsumer.as_asgi()),
   
]
