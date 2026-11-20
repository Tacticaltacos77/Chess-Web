import "./result-dialog.css";

// Wraps the <dialog> from game/_result_dialog.html. Esc and the Close button are built in
export class ResultDialog {
    constructor(element) {
        this.element = element;
        this.$title = element.querySelector(".result-dialog-title");
        this.$message = element.querySelector(".result-dialog-message");

        // A click on the dimmed backdrop lands on the <dialog> itself, a click inside lands on its content.
        // Only close if the press also started on the backdrop: the game-ending move opens this
        // mid-click, so that click's release can land here and would close it right away
        let pressedBackdrop = false;
        element.addEventListener("pointerdown", (event) => {
            pressedBackdrop = event.target === element;
        });
        element.addEventListener("click", (event) => {
            if (pressedBackdrop && event.target === element) element.close();
        });
    }

    show(title, message) {
        this.$title.textContent = title;
        this.$message.textContent = message;
        // showModal, not show: dims the page, blocks clicks behind it, and lets Esc close it
        this.element.showModal();
    }
}
