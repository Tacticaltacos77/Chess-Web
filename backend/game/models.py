from django.db import models
from users.models import User
# Create your models here.


class Game(models.Model):
    white = models.ForeignKey(User, on_delete=models.PROTECT, related_name="games_as_white")
    black = models.ForeignKey(User, on_delete=models.PROTECT, related_name="games_as_black")
    created_at = models.DateTimeField(auto_now_add=True)
    result = models.CharField()


