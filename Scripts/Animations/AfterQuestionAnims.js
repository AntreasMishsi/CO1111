

import { ClearRenderer, RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

export const animationDuration = 1000;


export function playCorrectAnimation() {
    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a green checkmark
    const check = document.createElement("div");
    check.innerHTML = "✔";
    check.style.position = "absolute";
    check.style.fontSize = "50px";
    check.style.color = "green";
    check.style.opacity = "0";
    check.style.transition = "all 0.5s ease-out";
    container.appendChild(check);

    // Animate the checkmark
    requestAnimationFrame(() => {
        check.style.opacity = "1";
        check.style.transform = "scale(1.5)";
    });

    // Fade out and remove after 1 second
    setTimeout(() => {
        check.style.opacity = "0";
        check.style.transform = "scale(1)";
        setTimeout(() => container.removeChild(check), 500);
    }, animationDuration);
}


export function playWrongAnimation() {
    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a red x
    const check = document.createElement("div");
    check.innerHTML = "X";
    check.style.position = "absolute";
    check.style.fontSize = "50px";
    check.style.color = "red";
    check.style.opacity = "0";
    check.style.transition = "all 0.5s ease-out";
    container.appendChild(check);

    // Animate the checkmark
    requestAnimationFrame(() => {
        check.style.opacity = "1";
        check.style.transform = "scale(1.5)";
    });

    // Fade out and remove after 1 second
    setTimeout(() => {
        check.style.opacity = "0";
        check.style.transform = "scale(1)";
        setTimeout(() => container.removeChild(check), 500);
    }, animationDuration);
}