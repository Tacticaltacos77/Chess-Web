from django.db import models

# Create your models here.
from users.models import User

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
    
    class Meta:
        constraints = [
            # One puzzle attmept for a specific puzzle per user
            models.UniqueConstraint(fields=["user", "puzzle"], name="one_attempt_per_user_per_puzzle "),
            # One puzzle attmpet that is in progress per user
            models.UniqueConstraint(fields=["user"], 
                condition=models.Q(status="in_progress"), 
                name="one_in_progress_per_user"                                   
            )]
