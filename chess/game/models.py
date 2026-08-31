from django.db import models
from users.models import User
# Create your models here.

class BoardSettings(models.Model):
    pieces_style = models.CharField(max_length=32, default="classic")
    board_style = models.CharField(max_length=32, default="classic")
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="board_settings",
    )
    

class Puzzle(models.Model):
    fen_start = models.TextField()
    rating = models.PositiveSmallIntegerField()
    

class Game(models.Model):
    white = models.ForeignKey(User, on_delete=models.PROTECT, related_name="games_as_white")
    black = models.ForeignKey(User, on_delete=models.PROTECT, related_name="games_as_black")
    white_delta = models.SmallIntegerField()
    black_delta = models.SmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    result = models.CharField()


class Rating(models.Model):
    class Category(models.TextChoices):
        PUZZLE = "puzzle", "Puzzle"
        BLITZ = "blitz", "Blitz"
        RAPID = "rapid", "Rapid"
        BULLET = "bullet", "Bullet"
    category = models.CharField(max_length=8, choices=Category.choices)
    value = models.PositiveSmallIntegerField()
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="ratings")
    class Meta:
        constraints = (
            models.UniqueConstraint(fields=("user", "category"), name="unique_rating_per_user_category"),
        )