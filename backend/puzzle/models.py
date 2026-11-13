from django.db import models


class Puzzle(models.Model):
    fen = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(db_index=True)
    moves = models.CharField(max_length=200)
    lichess_id = models.CharField(unique=True, max_length=5)
