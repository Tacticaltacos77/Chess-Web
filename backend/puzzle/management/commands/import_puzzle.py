import csv
from django.core.management.base import BaseCommand
from puzzle.models import Puzzle

class Command(BaseCommand):
    help = "Import puzzles from the Lichess puzzle CSV"
    
    def add_arguments(self, parser):
        parser.add_argument("csv_path")
        parser.add_argument("--limit", type=int, default=50_000)

    def handle(self, *args, csv_path, limit, **options):
        batch, count = [], 0
        with open(csv_path, newline="", encoding="utf-8") as f:
            # Fields: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,
            # NbPlays,Themes,GameUrl,OpeningTags,DailyDate
            for row in csv.DictReader(f):
                if int(row["Popularity"]) < 90 or int(row["NbPlays"]) < 1000:
                    continue  # keep only well-tested puzzles
                batch.append(Puzzle(
                    lichess_id=row["PuzzleId"],
                    fen=row["FEN"],
                    moves=row["Moves"],
                    rating=int(row["Rating"]),
                ))
                count += 1
                if len(batch) == 1000:
                    Puzzle.objects.bulk_create(batch, ignore_conflicts=True)
                    batch = []
                if count >= limit:
                    break
        Puzzle.objects.bulk_create(batch, ignore_conflicts=True)
        self.stdout.write(f"Imported up to {count} puzzles")
