from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework import status

from django.db import transaction, IntegrityError
from users.models import User, Rating
from .models import Puzzle, PuzzleAttempt
from .serializers import PuzzleSerialzier, PuzzleSubmitSerializer
from users.ratings import get_rating
from .services import pick_puzzle, update_puzzle_ratings

class RandomRankedPuzzleView(APIView):
    def get(self, request):
        try: 
            
        except IntegrityError:
            pass
        
        rating = get_rating(request.user, Rating.GameMode.PUZZLE)
        puzzles = Puzzle.objects.exclude(attempts__user = request.user)
        puzzle = pick_puzzle(puzzles, rating)

        if puzzle is None:
            raise NotFound("No puzzles available")
        return Response(PuzzleSerialzier(puzzle).data)
    
class PuzzleRankedAttemptView(APIView):
    @transaction.atomic(savepoint=False)
    def post(self, request, pk):
        serializer = PuzzleSubmitSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        attempt = PuzzleAttempt.objects.select_for_update().filter(user= request.user, puzzle=pk, status= PuzzleAttempt.Status.IN_PROGRESS).first()
        
        if attempt is None:
            return Response({"detail": "Not the user's currently active puzzle."}, status=status.HTTP_409_CONFLICT)

        data = serializer.validated_data
        assert isinstance(data, dict)
        
        attempt.status = data["result"]
        attempt.save(update_fields=["status"])
        result = 1 if attempt.status == "solved" else 0

        new_rating, change = update_puzzle_ratings(request.user, attempt.puzzle, result)
        return Response({"status": attempt.status, "rating": new_rating, "change": change})
            
class RandomCasualPuzzleView(APIView):
    permission_classes = [AllowAny]
    DIFFICULTY_OFFSET = {"easist": -600, "eaiser": -300, "normal":0, "harder":300, "hardest": 600}

    def get(self, request):
        user_rating = get_rating(request.user, Rating.GameMode.PUZZLE)
        puzzles = Puzzle.objects.all()
        puzzle = pick_puzzle(puzzles, user_rating)
        if puzzle is None:
            raise NotFound("No puzzles available")
        return Response(PuzzleSerialzier(puzzle).data)