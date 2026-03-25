// @ts-check
import { RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";


export class Stage {
    
    constructor(app) {
        this.app = app;
    }

    async OnStart() {
        throw new Error("Abstract method 'OnStart' must be implemented by subclass");
    }
    async OnEnd() {
        throw new Error("Abstract method 'OnEnd' must be implemented by subclass");
    }

    LockAllButtons() {
        const buttons = document.getElementById(RENDERED_AREA_ID).querySelectorAll("button, input[type='submit']");

        buttons.forEach(el => {
            el.disabled = true;
        });
    }

    UnlockAllButtons() {
        const buttons = document.getElementById(RENDERED_AREA_ID).querySelectorAll("button, input[type='submit']");

        buttons.forEach(el => {
            el.disabled = false;
        });
    }

}

