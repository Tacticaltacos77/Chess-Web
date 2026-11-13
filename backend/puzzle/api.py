from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny

from .models import Puzzle
from .serializers import PuzzleSerialzier
from .services import pick_puzzle


class RandomCasualPuzzleView(APIView):
    DIFFICULTIES = {"easiest": 400, "easiser": 800, "normal":1200, "harder":1600, "hardest": 2000}
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("difficulty", "normal")
        puzzles = Puzzle.objects.all()
        difficulty = self.DIFFICULTIES.get(query, self.DIFFICULTIES["normal"])
        puzzle = pick_puzzle(puzzles, difficulty)
        if puzzle is None:
            raise NotFound("No puzzles available")
        return Response(PuzzleSerialzier(puzzle).data)
