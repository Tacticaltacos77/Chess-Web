import { Chessboard, INPUT_EVENT_TYPE, FEN } from "cm-chessboard/src/Chessboard.js";
import { Markers } from "cm-chessboard/src/extensions/markers/Markers.js";
import { PromotionDialog, PROMOTION_DIALOG_RESULT_TYPE } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js";
import { Chess, validateFen } from "chess.js";
import "cm-chessboard/assets/chessboard.css";
import "cm-chessboard/assets/extensions/markers/markers.css";
import "cm-chessboard/assets/extensions/promotion-dialog/promotion-dialog.css";
import "./board.css";

import heavySoundURL from "@/assets/board/sounds/heavy.mp3";
import lightSoundURL from "@/assets/board/sounds/light.mp3";

const LAST_MOVE_MARKER = { class: "marker-last-move", slice: "markerSquare" };
const CHECK_MARKER = { class: "marker-check", slice: "markerSquare" };

const PIECE_SETS = ["standard", "staunty"];
const DEFAULT_PIECES = "standard";


const BOARD_SETS = ["default", "default-contrast", "green", "blue", "chess-club", "black-and-white"];
const DEFAULT_BOARD = "default";


const CAPTURE_SOUND = new Audio(heavySoundURL);
const MOVE_SOUND = new Audio(lightSoundURL);

const SOUND_VOLUME = 0.25;
CAPTURE_SOUND.volume = SOUND_VOLUME;
MOVE_SOUND.volume = SOUND_VOLUME;

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
        const moveObj = this.game.move(move);

        const sound = moveObj.isCapture() ? CAPTURE_SOUND : MOVE_SOUND;

        sound.currentTime = 0;
        sound.play().catch((err) => console.warn("Move sound didn't play:", err));

        this.syncBoard();
        return moveObj;
    }

  
    syncBoard(animate = true) {
        this.board.setPosition(this.game.fen(), animate);
        this.showLastMove();
        this.showCheck();
    }

    showCheck() {
        this.board.removeMarkers(CHECK_MARKER);
        if (!this.game.inCheck()) return;

        // The side to move is always the one in check
        const [kingSquare] = this.game.findPiece({ type: "k", color: this.game.turn() });
        this.board.addMarker(CHECK_MARKER, kingSquare);
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

        const matched_moves = this.game.moves({square: event.squareFrom, verbose: true})
            .filter((m)=> m.to === event.squareTo); 
        return matched_moves.length !==0;
    }

    onMoveCancel(event){
        this.board.removeLegalMovesMarkers();
    }

    async onMoveFinish(event){
        this.board.removeLegalMovesMarkers();
        if (!event.legalMove) return;

        const { squareFrom: from, squareTo: to } = event;
        let promotion;
        if (this.isPromotion(from, to)) {
            promotion = await this.askPromotion(to);
            // Canceled
            if (!promotion) return this.syncBoard();
        }
        this.onUserMove(this.makeMove({ from, to, promotion }));
    }

    // Subclasses override this to react to the users moves
    onUserMove(move) {}

    isPromotion(from, to){
        return this.game.moves({ square: from, verbose: true })
            .some((move) => move.to === to && move.promotion);
    }

    // Resolves with the picked piece ("q", "r", "b", "n"), or null if the user cancels
    askPromotion(square){
        return new Promise((resolve) => {
            this.board.showPromotionDialog(square, this.game.turn(), (result) => {
                const picked = result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected;
                // result.piece is like "wq"; chess.js wants just the "q"
                resolve(picked ? result.piece.charAt(1) : null);
            });
        });
    }
};