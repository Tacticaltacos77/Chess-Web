from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator

class User(AbstractUser):
    username = models.CharField(
        unique=True, 
        max_length=20, 
        validators=(
            MinLengthValidator(3),
            RegexValidator(r"^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]\Z", "Letters and numbers allowed, underscores and "
            "hyphens allowed if not at start and end")       
            )
        )
    email = models.EmailField(unique=True)


class BoardSettings(models.Model):
    pieces_style = models.CharField(max_length=32, default="classic")
    board_style = models.CharField(max_length=32, default="classic")
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="board_settings",
    )
