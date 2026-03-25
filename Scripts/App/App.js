
// @ts-check

import { AppState } from './AppState.js';

//Stages
import { ListStage } from '../Stages/ListStage.js';
import { StartStage } from '../Stages/StartStage.js';
import { QuestionStage } from '../Stages/QuestionStage.js';
import { LeaderBoardStage } from '../Stages/LeaderBoardStage.js';

import { Message } from '../Utils/Message.js';
import { fetchData } from '../Utils/Utils.js';


export class App {
    constructor() {
        this.session = null;
        this.name = null;

        this.numOfQuestions = null;
        this.treasureHuntName = null;
        this.treasureHuntID = null;

        this.score = 0;

        this.currentQuestion = null;
        this.currentQuestionData = null;

        this.appState = new AppState();
        this.StageList = [
            new ListStage(this),
            new StartStage(this),
            new QuestionStage(this),
            new LeaderBoardStage(this),
        ];
        this.StageList[this.appState.getCurentStage()].OnStart();
    }

    async ChangeStage() {
        await this.StageList[this.appState.getCurentStage()].OnEnd();
        
        this.appState.nextStage();
        await this.StageList[this.appState.getCurentStage()].OnStart();
    }
    

    Reset() {
        this.session = null;
        this.name = null;
        this.treasureHuntID = null;
    }

    SaveData() {
        let data = {
            session: this.session,
            name: this.name,
            treasureHuntID: this.treasureHuntID,
            score: this.score,
            stage: this.appState.getCurentStage(),
            questionData: this.currentQuestionData,
        };

        document.cookie = "app=" + JSON.stringify(data) + "; path=/";
    }

    LoadCookies() {
        let cookies = document.cookie.split("; ");
        console.log("Load cookie");
        for (let c of cookies) {
            let parts = c.split("=");
            let key = parts.shift();
            let value = parts.join("=");
            
            if (key === "app") {

                let data = JSON.parse(value);
                console.log(data);
                if(!data) return;
                if(data.session === null) {
                    break;
                }

                this.session = data.session;
                this.name = data.name;
                console.log(data.name);
                this.treasureHuntID = data.treasureHuntID;
                this.score = data.score;

                this.appState.setStage(data.stage);
                console.log("Stage: " + this.appState.getCurentStage());

                this.currentQuestionData = data.question;

                this.StageList[this.appState.getCurentStage()].OnStart();
                return;
            }
        }
        const tmpMSG = new Message("No cookies to load");
        tmpMSG.Display();
    }

    SetTreasureHuntID(id) {
        this.treasureHuntID = id;
        console.log(this.treasureHuntID);
        this.ChangeStage();
    }

    GetLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(SendLocationToAPI, ErrorGettingLocation);
        }
        else {
            const messageTMP = new Message("Location not supported by browser!");
            messageTMP.Display();
        }
    }
    GetAsyncLocation() {

    }
    

    StartGettingLocation() {
        this.GetLocation();

        this.locationInterval = setInterval(() => {
            this.GetLocation();
        }, 60000); // slightly more to avoid errors from api
    }


}


export const app = new App();


window.addEventListener("beforeunload", () => {

    app.SaveData();
});



function SendLocationToAPI(position) {
    const API_URL = `https://codecyprus.org/th/api/location?session=${app.session}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
    fetchData(API_URL).then((data) => {
        if(data.status === "OK") {
            console.log(data.message);
        }
        else {
            
            const messageTMP = new Message(data.errorMessages);
            messageTMP.Display();
        }
    });
}

function ErrorGettingLocation() {
    const messageTMP = new Message("Could not get location");
    messageTMP.Display();
}