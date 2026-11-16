import { Chessboard, INPUT_EVENT_TYPE, FEN } from "cm-chessboard/src/Chessboard.js";
import { Markers } from "cm-chessboard/src/extensions/markers/Markers.js";
import { PromotionDialog, PROMOTION_DIALOG_RESULT_TYPE } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js";
import { Chess, validateFen } from "chess.js";
import "cm-chessboard/assets/chessboard.css";
import "cm-chessboard/assets/extensions/markers/markers.css";
import "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css";
import "./board.css";

const LAST_MOVE_MARKER = { class: "marker-last-move", slice: "markerSquare" };

const PIECE_SETS = ["standard", "staunty"];
const DEFAULT_PIECES = "standard";


const BOARD_SETS = ["default", "default-contrast", "green", "blue", "chess-club", "black-and-white"];
const DEFAULT_BOARD = "default";

export class BoardSession {
    constructor(element, { pieces, board } = {}) {
        this.game = new Chess();
        this.board = new Chessboard(element, {
            position: this.game.fen(),
           
            assetsUrl: import.meta.env.BASE_URL,
            style: {
                cssClass: this.boardCssClass(board),
                pieces: { file: this.spritePiecesFile(pieces) },
                animationDuration: 200, 
            },
            extensions: [{ class: Markers }, { class: PromotionDialog }],
        });
        this.board.enableMoveInput(this.handleInput.bind(this));

        this.onRightClick = (e) => {
            if (e.button === 2) this.board.cancelMoveInput();
        };
        window.addEventListener("mousedown", this.onRightClick);
        // cancelMoveInput removes cm-chessboard's own context menu blocker, so block it here
        element.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    makeMove(move) {
        this.game.move(move);
        console.log(move);
        this.syncBoard();
    }

    // Use this instead of setPosition so the last-move highlight never falls behind
    syncBoard(animate = true) {
        this.board.setPosition(this.game.fen(), animate);
        this.showLastMove();
    }

    showLastMove() {
        this.board.removeMarkers(LAST_MOVE_MARKER);
        const last = this.game.history({ verbose: true }).at(-1);

        if (!last) return;
        this.board.addMarker(LAST_MOVE_MARKER, last.from);
        this.board.addMarker(LAST_MOVE_MARKER, last.to);
    }

    spritePiecesFile(piece_style) {
        if(!PIECE_SETS.includes(piece_style))
            piece_style = DEFAULT_PIECES;
        return `pieces/${piece_style}.svg`;
    }

    boardCssClass(board_style) {
        if(!BOARD_SETS.includes(board_style))
            board_style = DEFAULT_BOARD;
        return board_style;
    }

    loadPosition(fen){
        this.game.load(fen);
        this.syncBoard(false);
    }

    destroy(){
        window.removeEventListener("mousedown", this.onRightClick);
        this.board.destroy();
    }

    handleInput(event){
        switch (event.type) {
            case INPUT_EVENT_TYPE.moveInputStarted: return this.onMoveStart(event);
            case INPUT_EVENT_TYPE.validateMoveInput: return this.onValidate(event);
            case INPUT_EVENT_TYPE.moveInputCanceled: return this.onMoveCancel(event);
            case INPUT_EVENT_TYPE.moveInputFinished: return this.onMoveFinish(event);
        }
    }

    onMoveStart(event){
        const moves = this.game.moves({ square: event.squareFrom, verbose: true });
        if (moves.length === 0) {
            return false;
        }
        this.board.addLegalMovesMarkers(moves);
        return true;
    }
    onValidate(event){
        // A promotion can't be played until the user picks a piece,
        // so allow the drop now and play it once the dialog answers
        if (this.isPromotion(event.squareFrom, event.squareTo)) {
            this.pendingPromotion = { from: event.squareFrom, to: event.squareTo };
            return true;
        }
        try {
            this.game.move({ from: event.squareFrom, to: event.squareTo });
        } catch {
            return false;
        }
        return true;
    }

    onMoveCancel(event){
        this.board.removeLegalMovesMarkers();
    }

    onMoveFinish(event){
        this.board.removeLegalMovesMarkers();
        if (!event.legalMove) return;

        if (this.pendingPromotion) {
            const { from, to } = this.pendingPromotion;
            this.pendingPromotion = null;
            this.askPromotion(from, to);
            return;
        }
        // onValidate already played it in chess.js, so it's the last move in the history
        this.onUserMove(this.game.history({ verbose: true }).at(-1));
    }

    isPromotion(from, to){
        return this.game.moves({ square: from, verbose: true })
            .some((move) => move.to === to && move.promotion);
    }

    askPromotion(from, to){
        this.board.showPromotionDialog(to, this.game.turn(), (result) => {
            if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected) {
                // result.piece is like "wq"; chess.js wants just the "q"
                const move = this.game.move({ from, to, promotion: result.piece.charAt(1) });
                this.onUserMove(move);
            } else {
                this.syncBoard();
            }
        });
    }

    // Subclasses override this. Runs once a user's move is fully played, promotions included
    onUserMove(move){
        this.syncBoard();
    }
}