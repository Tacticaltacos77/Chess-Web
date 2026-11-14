import { Chessboard } from "cm-chessboard/src/Chessboard.js";
import "cm-chessboard/assets/chessboard.css";
import "./home.css";

// Final position of Morphy's Opera Game (1858), right after 17. Rd8#
const OPERA_GAME_FINAL = "1n1Rkb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2K5 b k - 1 17";

// Display only: no enableMoveInput(), so the pieces can't be dragged
new Chessboard(document.getElementById("home-board"), {
    position: OPERA_GAME_FINAL,
    assetsUrl: import.meta.env.BASE_URL,
    style: {
        cssClass: "default",
        pieces: { file: "pieces/standard.svg" },
    },
});
