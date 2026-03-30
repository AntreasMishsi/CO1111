import { Stages } from '../Stages/Stages.js';

// manages the state of the app
export class AppState {
    constructor() {
        this.currentStage = Stages.List;
    }
    // go to next stage make and make sure the value stays in boundaries
    nextStage() {
        if (this.currentStage < Stages.LeaderBoard) {
            this.currentStage++;
        }
        console.log("Current Stage:", this.currentStage);
    }

    getCurentStage() { return this.currentStage; }

    setStage(newStage) {
        if (newStage >= Stages.List && newStage <= Stages.LeaderBoard) {
            this.currentStage = newStage;
        }
    }

}