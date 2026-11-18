import { validateFen } from "chess.js";
import { BoardSession } from "../board/board";

// Own marker type so removing the hint never removes the boards other markers
const HINT_MARKER = { class: "marker-hint", slice: "markerSquare" };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class PuzzleSession extends BoardSession{
    constructor(element, { pieces, board, onStart, onCorrect, onWrong, onSolved }){
        super(element, { pieces, board });
        this.moves = [];
        this.onStart = onStart ?? (() => {});
        this.onCorrect = onCorrect ?? (() => {});
        this.onWrong = onWrong ?? (() => {});
        this.onSolved = onSolved ?? (() => {});
    }

    async loadPuzzle(puzzle){
        this.puzzle = puzzle;
        await this.startPuzzle();
    }

    async startPuzzle() {
        this.answered_wrong = false;
        this.board.removeMarkers(HINT_MARKER);
        this.loadPosition(this.puzzle.fen);
        this.moves = this.puzzle.moves.split(" ");
        this.move_ind = 0;

        // The bot plays first
        this.userColor = this.game.turn() === "w" ? "b" : "w";
        await this.board.setOrientation(this.userColor);

        this.board.disableMoveInput();
        this.board.enableMoveInput(this.handleInput.bind(this), this.userColor);

        
        this.onStart();

        // Small delay so that player has time to actually see the move be played on load
        await sleep(400);
        this.playOppTurn();
    }

    playOppTurn() {
        this.makeMove(this.moves[this.move_ind]);
        this.move_ind++;
    }

    showHint() {
        if (this.move_ind >= this.moves.length) return;
        if (this.game.turn() !== this.userColor) return;
        if (this.board.getMarkers(HINT_MARKER).length > 0) return;

        // Using a hint means the puzzle wasn't solved cleanly. For when Rated version is added
        this.answered_wrong = true;

        // Moves are like "e2e4" or "e7e8q": chars 0-2 are the from square, 2-4 the to square
        const move = this.moves[this.move_ind];
        this.board.addMarker(HINT_MARKER, move.slice(0, 2));
        this.board.addMarker(HINT_MARKER, move.slice(2, 4));
    }

    // Override: BoardSession calls this after every user move
    onUserMove(move){
        this.board.removeMarkers(HINT_MARKER);

        // Any checkmate counts, since some puzzles have more than one mating move
        const correct = move.lan === this.moves[this.move_ind] || this.game.isCheckmate();

        if (!correct) {
            this.answered_wrong = true;
            this.game.undo();
            this.syncBoard();
            this.onWrong();
            return;
        }

        this.syncBoard();
        this.move_ind++;

        if (this.move_ind >= this.moves.length || this.game.isCheckmate()) {
            this.board.disableMoveInput();
            this.onSolved();
            return;
        }

        this.onCorrect();
        this.playOppTurn();
    }
}
