from rest_framework import serializers
from .models import Puzzle, PuzzleAttempt

class PuzzleSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Puzzle
        fields = ["id", "fen_start", "rating"]


class PuzzleSubmitSerializer(serializers.Serializer):
    result = serializers.ChoiceField(choices=[PuzzleAttempt.Status.FAILED, PuzzleAttempt.Status.SOLVED])
       
        