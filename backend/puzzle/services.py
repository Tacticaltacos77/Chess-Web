from .models import Puzzle
from django.db.models import QuerySet
from django.db import transaction
from users.models import User, Rating

from users.ratings import get_rating, new_ratings

MAX_OFFSET = 800
MIN_OFFSET = 100

def pick_puzzle(puzzles: QuerySet[Puzzle], rating: int) -> None | Puzzle:
    potential_puzzles = None
    offset = MIN_OFFSET
    while offset <= MAX_OFFSET:
        potential_puzzles = puzzles.filter(rating__range=(rating-offset, rating+offset))
        if potential_puzzles.exists():
            return potential_puzzles.order_by("?").first()
        offset+=100
    return None


# FUTURE MAKE THE PUZZLES DYNAMIC IN RATING AS WELL
@transaction.atomic
def update_puzzle_ratings(user: User, puzzle: Puzzle, result: int) -> tuple[int, int]:
    rating, _ = Rating.objects.select_for_update().get_or_create(user=user, game_mode=Rating.GameMode.PUZZLE)
    puzzle = Puzzle.objects.get(pk=puzzle.pk) 
    old_rating_value = rating.value
    new_rating_value, _ = new_ratings(old_rating_value, puzzle.rating, result)
    rating.value = new_rating_value
    rating.save(update_fields=["value"])
    return new_rating_value, new_rating_value - old_rating_value