import { PuzzleSession } from "./puzzle.js";

const element = document.getElementById("board");

let puzzleSession = null;
if (element) {
    puzzleSession = new PuzzleSession(element, {
        fen: element.dataset.fen,
        pieces: element.dataset.pieces,
        board: element.dataset.board,
    });
}