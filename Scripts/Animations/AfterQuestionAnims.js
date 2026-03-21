

import { ClearRenderer, RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

export const animationDuration = 2000;


export function playCorrectAnimation() {
    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a green checkmark
    const check = document.createElement("div");
    check.className = "correct-animation-container";
    check.innerHTML = `<img src=../Resources/icons/check.svg alt="correct icon" style="width:300px; height: 300px;">`;
    check.style.fontSize = "50px";
    check.style.color = "green";
    check.style.transition = "all 0.5s ease-out";
    container.appendChild(check);

    // Animate the checkmark
    requestAnimationFrame(() => {
       
    });

    // Fade out and remove after 1 second
    setTimeout(() => {
       
        
    }, animationDuration);
}


export function playWrongAnimation() {
    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a red x
    const check = document.createElement("div");
    check.innerHTML = "X";
    check.style.fontSize = "50px";
    check.style.color = "red";
    check.style.opacity = "0";
    check.style.transition = "all 0.5s ease-out";
    container.appendChild(check);

    // Animate the checkmark
    requestAnimationFrame(() => {
        
    });

    // Fade out and remove after 1 second
    setTimeout(() => {
        container.removeChild(check);
    }, animationDuration);
}