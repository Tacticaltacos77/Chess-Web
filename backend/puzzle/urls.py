from django.urls import path
from .views import PuzzleView


urlpatterns = [
    path("puzzle/", PuzzleView.as_view(), name="puzzle")
]