from rest_framework import serializers
from .models import Puzzle

class PuzzleSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Puzzle
        fields = ["id", "fen", "moves","rating"]
