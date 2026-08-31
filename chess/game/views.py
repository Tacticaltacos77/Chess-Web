from django.shortcuts import render
from django.views import View

from .models import Puzzle



def play(request):
    return render(request,"game/onlinegame.html")

class RandomPuzzleDetailView(View):
    def get(self, request):
        puzzle = Puzzle.objects.order_by("?").first()
        return render(request, "game/puzzle.html", {"puzzle": puzzle})
    