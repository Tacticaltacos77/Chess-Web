import { BoardSession } from "@/board/board";
import "./game.css";

export const RESULT_TEXT = { "1-0": "White wins", "0-1": "Black wins", "1/2-1/2": "Draw" };

export class GameSession extends BoardSession {
    constructor(element, { pieces, board, onStart, onMove, onGameOver }) {
        super(element, { pieces, board });
        this.userColor = null;

        this.onStart = onStart ?? (() => {});
        this.onMove = onMove ?? (() => {});
        // Different name so it doesn't replace the onGameOver hook below
        this.notifyGameOver = onGameOver ?? (() => {});

        this.board.disableMoveInput();
    }

    async startGame({ color }) {
        this.loadPosition();
        this.userColor = color;
        // A local game (null) keeps white at the bottom
        await this.board.setOrientation(color ?? "w");
        this.board.disableMoveInput();
        // Null color means both colors can move
        this.board.enableMoveInput(this.handleInput.bind(this), color);

        this.onStart();
    }

    playOpponentMove(lan) {
        this.makeMove(lan);
    }

    endGame() {
        this.board.disableMoveInput();
    }

    onUserMove(move) {
        this.onMove(move);
    }

    onGameOver(result) {
        this.notifyGameOver(result);
    }
}
