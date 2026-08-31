from django.urls import path
from .views import RandomPuzzleDetailView, play

urlpatterns = [
    path("puzzle/", RandomPuzzleDetailView.as_view(), name="random-puzzle"),
    path("play/", play, name='play'), 
]
