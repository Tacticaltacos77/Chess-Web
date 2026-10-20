from .models import Puzzle
from django.db.models import QuerySet
from django.db import transaction
from users.models import User, Rating

from users.ratings import get_rating, new_ratings

MAX_OFFSET = 800
MIN_OFFSET = 100

def pick_puzzle(puzzles: QuerySet[Puzzle], rating: int) -> None | Puzzle:
    puzzle = None
    offset = MIN_OFFSET
    while not puzzle and offset <= MAX_OFFSET:
        puzzle = puzzles.filter(rating__range=(rating-offset, rating+offset))
        offset+=100
    if not puzzle:
        return None
    return puzzle.order_by("?").first()


# FUTURE MAKE THE PUZZLES DYNAMIC IN RATING AS WELL
@transaction.atomic
def update_puzzle_ratings(user: User, puzzle: Puzzle, result: int) -> tuple[int, int]:
    user_rating, _ = Rating.objects.select_for_update().get_or_create(user=user, game_mode=Rating.GameMode.PUZZLE)
    puzzle = Puzzle.objects.get(pk=puzzle.pk) 
    new_user_rating, _ = new_ratings(user_rating.value, puzzle.rating, result)
    user_rating.value = new_user_rating
    user_rating.save(update_fields=["value"])
    return new_user_rating, new_user_rating - user_rating.value