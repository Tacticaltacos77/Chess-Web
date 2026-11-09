import { PuzzleSession } from "./puzzle.js";
import "./puzzle.css";
import { setupToggle } from "@/components/toggle/toggle.js";

const board = document.getElementById("board");

new PuzzleSession(board, {
    fen: board.dataset.fen,
    pieces: board.dataset.pieces,
    board: board.dataset.board,
});

const rated_toggle = document.getElementById("puzzle-rated-toggle");



let current_side_panel_view = "puzzle-setup-view";


setupToggle(rated_toggle);