from django.shortcuts import render
from django.views.generic import TemplateView

from .models import Puzzle

# Create your views here.
class PuzzleView(TemplateView):
    def get(self, request):
        return render(request, "puzzle/puzzle.html")

