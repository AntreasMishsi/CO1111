import { Stages } from '../Stages/Stages.js';

export class AppState {
    constructor() {
        this.currentStage = Stages.List;
    }

    nextStage() {
        if (this.currentStage < Stages.LeaderBoard) {
            this.currentStage++;
        }
        console.log("Current Stage:", this.currentStage);
    }

    getCurentStage() { return this.currentStage; }

    setStage(newStage) {
        if (newStage < Stages.LeaderBoard) {
            this.currentStage = newStage;
        }
    }

}