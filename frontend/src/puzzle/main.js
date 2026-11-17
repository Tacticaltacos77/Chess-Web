import { PuzzleSession } from "./puzzle.js";
import { SidePanel } from "../components/sidepanel/panel.js";
import "./puzzle.css";
import { getCasualPuzzle } from "./api.js";

const $sidepanel = document.getElementById("side-panel");

const sidepanel = new SidePanel($sidepanel);

const $board = document.getElementById("board");

const session = new PuzzleSession($board, {
    fen: $board.dataset.fen,
    pieces: $board.dataset.pieces,
    board: $board.dataset.board,
    onStart: () => {
        showPuzzleInfo(session.puzzle);
        sidepanel.show("inProgress");
    },
    onSolved: () => sidepanel.show("completed"),
});

const COLOR_NAMES = { w: "White", b: "Black" };

function showPuzzleInfo(puzzle) {
    for (const rating of document.querySelectorAll(".puzzle-rating")) {
        rating.textContent = puzzle.rating;
    }
    document.getElementById("puzzle-status").textContent = `${COLOR_NAMES[session.userColor]} to move`;
}

const difficultySelects = document.querySelectorAll(".puzzle-difficulty");
let difficulty = difficultySelects[0].value;

for (const select of difficultySelects) {
    select.addEventListener("change", () => {
        difficulty = select.value;
        // Keep the other dropdown showing the same choice
        for (const other of difficultySelects) other.value = difficulty;
    });
}


async function startNewPuzzle() {
    try{
        const puzzle = await getCasualPuzzle(difficulty);
        await session.loadPuzzle(puzzle);
    } catch (err) {
        console.error(err);
    }
}

document.getElementById("play-button").addEventListener("click", startNewPuzzle);
document.getElementById("next-button").addEventListener("click", startNewPuzzle);

document.getElementById("retry-button").addEventListener("click", () => {
    session.startPuzzle();
});

document.getElementById("hint-button").addEventListener("click", () => {
    session.showHint();
});
