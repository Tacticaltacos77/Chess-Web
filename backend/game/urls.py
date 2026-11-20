from django.urls import path
from .views import play, play_online, play_local

urlpatterns = [
    path("play/", play, name="play"),
    path("play/online/", play_online, name="play_online"),
    path("play/local/", play_local, name="play_local"),
]
