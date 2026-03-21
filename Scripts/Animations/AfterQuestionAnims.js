

import { ClearRenderer, RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

import { sleep } from "../Utils/Utils.js";

export const animationDuration = 2000;

export const FADE_IN_DURATION = 500;
export const FADE_OUT_DURATION = 500;

export function playCorrectAnimation() {

    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a green checkmark
    const check = document.createElement("div");
    check.className = "correct-animation-container";
    check.innerHTML = `<img src=../Resources/icons/check.svg alt="correct icon" style="width:300px; height: 300px;">`;
    check.style.fontSize = "50px";
    check.style.color = "green";
    container.appendChild(check);

    

    
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


export async function FadeIn() {
    document.getElementById(RENDERED_AREA_ID).classList.add("fade-in");
    document.getElementById(RENDERED_AREA_ID).classList.remove("fade-out");
    await sleep(FADE_IN_DURATION);
    document.getElementById(RENDERED_AREA_ID).classList.remove("fade-in");
}

export async function FadeOut() {
    document.getElementById(RENDERED_AREA_ID).classList.add("fade-out");
    document.getElementById(RENDERED_AREA_ID).classList.remove("fade-in");
    await sleep(FADE_OUT_DURATION);
    document.getElementById(RENDERED_AREA_ID).classList.remove("fade-out");
}