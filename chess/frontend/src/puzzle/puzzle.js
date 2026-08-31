import { validateFen } from "chess.js";
import { BoardSession } from "../board/board";

export class PuzzleSession extends BoardSession{
    constructor(element, { pieces, board } = {}){
        super(element, { pieces, board });
        this.user_answers = new Map();
        this.user_correct_moves = [];
        this.enemy_moves = [];
    }
    loadPuzzle({fen, moves}){
        if(validateFen(fen).ok){
            this.answered_wrong = false;
            this.ans_ind = 0;
            this.user_answers.clear();
            this.user_correct_moves = [];
            this.enemy_moves = [];
            this.loadPosition(fen);
        }
    }
    onMoveFinish(event){
        this.board.removeLegalMovesMarkers();
        if (event.legalMove) {
     
            this.board.setPosition(this.game.fen(), true);
        }
    }
}