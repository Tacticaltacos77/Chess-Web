from django.urls import path
from .views import RandomPuzzleDetailView

urlpatterns = [
    path('puzzle/', RandomPuzzleDetailView.as_view(), name='api-random-puzzle'),
]