

import { RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

const LOADING_ANIMATION_ID = "loading-animation";

let IsThereALoader = false;

export function AddLoadingAnimation() {
    const container = document.createElement("div");

    container.innerHTML = `<span class="loader"></span>`;

    if(!IsThereALoader) {
        document.getElementById(LOADING_ANIMATION_ID).appendChild(container);
        IsThereALoader = true;
    }
    
}

export function RemoveLoadingAnimation() {
    document.getElementById(LOADING_ANIMATION_ID).innerHTML = '';
    IsThereALoader = false;
}