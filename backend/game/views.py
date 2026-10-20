from django.shortcuts import render
from django.views import View

def play(request):
    return render(request,"game/onlinegame.html")
