from django.shortcuts import render
from django.views.generic import TemplateView

from .models import Puzzle

# Create your views here.
class PuzzleView(TemplateView):
    template_name = "puzzle/puzzle.html"

