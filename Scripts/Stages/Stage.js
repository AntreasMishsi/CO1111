// @ts-check
import { RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";


export class Stage {
    
    constructor(app) {
        this.app = app;
    }
    // called in app when stage starts
    async OnStart() {
        throw new Error("Abstract method 'OnStart' must be implemented by subclass");
    }
    // called when stag changes
    async OnEnd() {
        throw new Error("Abstract method 'OnEnd' must be implemented by subclass");
    }
    // lock buttons to avoid double api requests
    LockAllButtons() {
        const buttons = document.getElementById(RENDERED_AREA_ID).querySelectorAll("button, input[type='submit']");

        buttons.forEach(el => {
            el.disabled = true;
        });
    }
    // unlock buttons all buttons
    UnlockAllButtons() {
        const buttons = document.getElementById(RENDERED_AREA_ID).querySelectorAll("button, input[type='submit']");

        buttons.forEach(el => {
            el.disabled = false;
        });
    }

}

