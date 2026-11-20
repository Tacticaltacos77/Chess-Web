from django.shortcuts import redirect, render

# The mode picker on play.html submits ?mode=..., which sends you to that mode's page
MODE_PAGES = {"online": "play_online", "local": "play_local"}

def play(request):
    mode = request.GET.get("mode")
    if mode in MODE_PAGES:
        return redirect(MODE_PAGES[mode])
    return render(request, "game/play.html")

def play_online(request):
    return render(request, "game/onlinegame.html")

def play_local(request):
    return render(request, "game/localgame.html")
