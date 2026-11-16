import "./panel.css";

export class SidePanel {
    constructor(element) {
        this.element = element;
        this.views = element.querySelectorAll("[data-view]");
    }

    show(name) {
        for (const view of this.views) {
            view.hidden = view.dataset.view !== name;
        }
    }
}
