from django.urls import path
from .views import PuzzleView
from .api import RandomCasualPuzzleView


urlpatterns = [
    path("puzzle/", PuzzleView.as_view(), name="puzzle"),
    path("api/puzzles/casual/random/", RandomCasualPuzzleView.as_view(), name="random_casual_puzzle"),
]