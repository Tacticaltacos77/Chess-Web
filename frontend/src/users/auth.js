// Show/hide buttons on password fields (login and register)
for (const toggle of document.querySelectorAll(".password-toggle")) {
    const input = toggle.parentElement.querySelector("input");

    toggle.addEventListener("click", () => {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        // CSS swaps the eye icon off this, and screen readers announce it as on/off
        toggle.setAttribute("aria-pressed", String(show));
    });
}
