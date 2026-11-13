from .models import Puzzle
from django.db.models import QuerySet

RANGE = 400

def pick_puzzle(puzzles: QuerySet[Puzzle], rating: int) -> None | Puzzle:
    potential_puzzles = puzzles.filter(rating__range=(rating-RANGE, rating+RANGE))
    if potential_puzzles.exists():
        return potential_puzzles.order_by("?").first()

    return None
