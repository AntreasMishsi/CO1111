import { ClearRenderer, RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

import { sleep } from "../Utils/Utils.js";


// how long the animation plays
// should always much with css
export const animationDuration = 1500;

//fade in fade out durations
export const FADE_IN_DURATION = 1000;
export const FADE_OUT_DURATION = 500;

export function playCorrectAnimation(text) {

    const container = document.getElementById(RENDERED_AREA_ID);
    ClearRenderer();

    // Create a glass checkmark
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


