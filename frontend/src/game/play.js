import { BoardSession } from "../board/board";
import "../components/sidepanel/panel.css";
import "../components/board-layout/board-layout.css";
import "./game.css";
import "./play.css";

// Only a backdrop while picking a mode: the starting position, no moves allowed
const $board = document.getElementById("board");
const preview = new BoardSession($board, { pieces: $board.dataset.pieces, board: $board.dataset.board });
preview.board.disableMoveInput();
