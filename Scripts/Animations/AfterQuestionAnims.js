

import { ClearRenderer, RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

import { sleep } from "../Utils/Utils.js";


//users A, B, C didnt like the rotatitating animation, 
//users A, B found animations slow
// user C found a bag that changed animation from correct to wrong, it was due to fact that submit button could be pressed multiple times during fade out
export const animationDuration = 1500;

export const FADE_IN_DURATION = 500;
export const FADE_OUT_DURATION = 500;

export function playCorrectAnimation() {

    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a green checkmark
    const check = document.createElement("div");
    check.className = "correct-animation-container";
    check.innerHTML = `<img src=../Resources/icons/check.svg alt="correct icon" style="width:300px; height: 300px; color: color: #4FC3F7;">`;
    check.style.fontSize = "50px";
    check.style.color = "green";
    container.appendChild(check);

    

    
}


export function playWrongAnimation() {
    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a red x
    const check = document.createElement("div");
    check.className = "wrong-animation-container";
    check.innerHTML = `<img src=../Resources/icons/x.svg alt="wrong icon" style="width:300px; height: 300px;">`;

    container.appendChild(check);

    // Animate the checkmark
    

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