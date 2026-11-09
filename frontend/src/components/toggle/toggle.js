import "./toggle.css";

export function setupToggle(button){
    button.addEventListener("click", ()=>  {
        const on = button.getAttribute("selected") !==  "true";
        button.setAttribute("selected", on);
    });
}
