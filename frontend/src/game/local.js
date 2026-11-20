import { GameSession, RESULT_TEXT } from "./game.js";
import { COLOR_NAMES } from "../board/board";
import { SidePanel } from "../components/sidepanel/panel.js";
import { ResultDialog } from "../components/result-dialog/result-dialog.js";
import "../components/board-layout/board-layout.css";
import "./game.css";

const sidepanel = new SidePanel(document.getElementById("side-panel"));
const resultDialog = new ResultDialog(document.getElementById("result-dialog"));
const $board = document.getElementById("board");
const $turn = document.getElementById("game-turn");
const $result = document.getElementById("game-result");
const $reason = document.getElementById("game-result-reason");
const $topName = document.querySelector("#player-top .player-name");
const $bottomName = document.querySelector("#player-bottom .player-name");

const session = new GameSession($board, {
    pieces: $board.dataset.pieces,
    board: $board.dataset.board,
    onMove: showTurn,
    onGameOver: showResult,
});

function showResult({ result, reason }) {
    session.endGame();
    $result.textContent = RESULT_TEXT[result];
    $reason.textContent = `by ${reason}`;
    sidepanel.show("completed");
    resultDialog.show(RESULT_TEXT[result], `by ${reason}`);
}

function showTurn() {
    $turn.textContent = `${COLOR_NAMES[session.game.turn()]} to move`;
}

function showPlayerNames() {
    const bottomColor = session.board.getOrientation();
    $bottomName.textContent = COLOR_NAMES[bottomColor];
    $topName.textContent = COLOR_NAMES[bottomColor === "w" ? "b" : "w"];
}

async function newGame() {
    await session.startGame({ color: null });
    showPlayerNames();
    showTurn();
    sidepanel.show("inProgress");
}

document.getElementById("flip-board-button").addEventListener("click", async () => {
    await session.flipBoard();
    showPlayerNames();
});
document.getElementById("restart-button").addEventListener("click", newGame);
document.getElementById("new-game-button").addEventListener("click", newGame);
newGame();
