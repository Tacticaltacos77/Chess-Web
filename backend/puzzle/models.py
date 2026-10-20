from django.db import models

# Create your models here.
from ..users.models import User

class Puzzle(models.Model):
    fen_start = models.TextField()
    rating = models.PositiveSmallIntegerField()

class PuzzleAttempt(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "In progress"
        SOLVED = "solved", "Solved"
        FAILED = "failed", "Failed"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    puzzle = models.ForeignKey(Puzzle, on_delete=models.PROTECT, related_name="attempts")
    status = models.CharField(choices=Status.choices, default=Status.IN_PROGRESS)
    
