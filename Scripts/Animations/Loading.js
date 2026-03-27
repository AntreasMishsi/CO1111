

import { RENDERED_AREA_ID } from "../Utils/ClearRenderer";

const LOADING_ANIMATION_ID = "loading-animation";

let IsThereALoader = false;

function AddLoadingAnimation() {
    const container = document.createElement("div");

    container.innerHTML = `<span class="loader"></span>`;

    if(IsThereALoader) {
        document.getElementById(LOADING_ANIMATION_ID).innerHTML += container;
        IsThereALoader = true;
    }
    
}

function RemoveLoadingAnimation() {
    
}