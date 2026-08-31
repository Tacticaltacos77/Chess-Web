import { Chessboard, INPUT_EVENT_TYPE, FEN } from "cm-chessboard/src/Chessboard.js";
import { Markers } from "cm-chessboard/src/extensions/markers/Markers.js";
import { Chess, validateFen } from "chess.js";
import "cm-chessboard/assets/chessboard.css";
import "cm-chessboard/assets/extensions/markers/markers.css";

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
            },
            extensions: [{ class: Markers }],
        });
        this.board.enableMoveInput(this.handleInput.bind(this));
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
        this.board.setPosition(fen, false);
    }

    destroy(){
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
        try {
            this.game.move({
                from: event.squareFrom,
                to: event.squareTo,
                promotion: event.promotion,
            });
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
        if (event.legalMove) {
            this.board.setPosition(this.game.fen(), true);
        }
    }
}