from django.contrib.auth.models import AbstractUser
from django.db import models

DEFAULT_RATING = 1000

class User(AbstractUser):
    elo_rating = models.PositiveIntegerField(default=1200)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

class BoardSettings(models.Model):
    pieces_style = models.CharField(max_length=32, default="classic")
    board_style = models.CharField(max_length=32, default="classic")
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="board_settings",
    )

class Rating(models.Model):
    class GameMode(models.TextChoices):
        PUZZLE = "puzzle", "Puzzle"
        BLITZ = "blitz", "Blitz"
        RAPID = "rapid", "Rapid"
        BULLET = "bullet", "Bullet"
    game_mode = models.CharField(max_length=8, choices=GameMode.choices)
    value = models.PositiveSmallIntegerField(default=DEFAULT_RATING)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    class Meta:
        constraints = (
            models.UniqueConstraint(fields=("user", "game_mode"), name="unique_rating_per_user_game_mode"),
        )