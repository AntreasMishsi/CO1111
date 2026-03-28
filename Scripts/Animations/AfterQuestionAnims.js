import { ClearRenderer, RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

import { sleep } from "../Utils/Utils.js";


//users A, B, C didnt like the rotatitating animation, 
//users A, B found animations slow
// user C found a bag that changed animation from correct to wrong, it was due to fact that submit button could be pressed multiple times during fade out
export const animationDuration = 1500;

export const FADE_IN_DURATION = 500;
export const FADE_OUT_DURATION = 500;

export function playCorrectAnimation(text) {

    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a green checkmark
    const check = document.createElement("div");
    check.className = "correct-animation-container";
    check.innerHTML = `
    <img src="Resources/icons/check.png" alt="correct icon" style="width:300px; height: 300px;">
    <p class="correct-animation-text">${text}</p>
    `;
    check.style.fontSize = "50px";
    
    container.appendChild(check);




}


export function playWrongAnimation(text) {
    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();
    // Create a red x
    const check = document.createElement("div");
    check.className = "wrong-animation-container";
    check.innerHTML = `
    <img src="Resources/icons/x.png" alt="wrong icon" style="width:300px; height:300px;">
    <p class="wrong-animation-text">${text}</p>`;
    container.appendChild(check);

    
    

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

export async function FadeInForElementWithId(ID) {
    document.getElementById(ID).classList.add("fade-in");
    document.getElementById(ID).classList.remove("fade-out");
    await sleep(FADE_IN_DURATION);
    document.getElementById(ID).classList.remove("fade-in");
}

export async function FadeOutForElementWithId(ID) {
    document.getElementById(ID).classList.add("fade-out");
    document.getElementById(ID).classList.remove("fade-in");
    await sleep(FADE_OUT_DURATION);
   
}


