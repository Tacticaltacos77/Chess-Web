from .models import User, Rating, DEFAULT_RATING
from django.db import transaction
from elote import EloCompetitor




def get_rating(user: User, game_mode: Rating.GameMode) -> int:
    rating = Rating.objects.filter(user=user, game_mode=game_mode).first()
    if rating:
        return rating.value
    return DEFAULT_RATING

def new_ratings(rating: int, opp_rating: int, result: float) -> tuple[int, int]:
    user = EloCompetitor(rating)
    opp = EloCompetitor(opp_rating)
    if result == 1:
        user.beat(opp)
    elif result == 0:
        user.lost_to(opp)
    else:
        user.tied(opp)
    return round(user.rating), round(opp.rating)
    
