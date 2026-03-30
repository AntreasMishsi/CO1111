
// @ts-check

import { AppState } from './AppState.js';

//Stages
import { ListStage } from '../Stages/ListStage.js';
import { StartStage } from '../Stages/StartStage.js';
import { QuestionStage } from '../Stages/QuestionStage.js';
import { LeaderBoardStage } from '../Stages/LeaderBoardStage.js';
import { Stages } from '../Stages/Stages.js';

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
        this.currentQuestionIndex = 0;
        this.numOfQuestions = 0;
        this.currentQuestionData = null;

        this.curentTime = Date.now();

        this.appState = new AppState();
        this.StageList = [
            new ListStage(this),
            new StartStage(this),
            new QuestionStage(this),
            new LeaderBoardStage(this),
        ];
        this.LoadCookies();
        
        console.log(this.session);
        if(!this.session || !this.name) {
            this.appState.setStage(Stages.List);
            this.StageList[this.appState.getCurentStage()].OnStart();
        }
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
        this.session = null;
        this.name = null;

        this.numOfQuestions = null;
        this.treasureHuntName = null;
        this.treasureHuntID = null;

        this.score = 0;

        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        this.numOfQuestions = 0;
        this.currentQuestionData = null;
        this.curentTime = Date.now();
        

        this.appState = new AppState();
        document.cookie = "app=; max-age=0; path=/;";

        this.appState.setStage(Stages.List);
        this.StageList[this.appState.getCurentStage()].OnStart();
    }

//#region Cookies
    SaveData() {
        
        let data = {
            session: this.session,
            name: this.name,
            treasureHuntID: this.treasureHuntID,
            score: this.score,
            stage: this.appState.getCurentStage(),

            currentQuestionIndex : this.currentQuestionIndex,
            numOfQuestions : this.numOfQuestions,
            questionData: this.currentQuestionData,

            timestamp: this.curentTime,
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
                if(data.name === null) {
                    break;
                }
                const SESSION_TIME = 30 * 60 * 1000;
                console.log(data)
                if (!data.timestamp || (Date.now() - data.timestamp > SESSION_TIME)) {
                    console.log("Cookie expired (more than 30 minutes)");
                    
                    this.Reset();
                    break;
                }

                this.session = data.session;
                this.name = data.name;
                console.log(data.name);
                this.treasureHuntID = data.treasureHuntID;
                this.score = data.score;
                
                
                this.appState.setStage(data.stage);
                console.log("Stage: " + this.appState.getCurentStage());
                

                this.numOfQuestions = data.numOfQuestions;
                console.log(data.currentQuestionIndex);
                this.currentQuestionIndex = data.currentQuestionIndex;
                this.currentQuestionData = data.question;

                this.StageList[this.appState.getCurentStage()].OnStart();
                return;
            }
        }
        const tmpMSG = new Message("No cookies to load");
        tmpMSG.Display();
    }
//#endregion

    SetTreasureHuntID(id) {
        this.treasureHuntID = id;
        console.log(this.treasureHuntID);
        this.ChangeStage();
    }

    

    


//#region location
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
        return new Promise((resolve, reject) => {

            if (!navigator.geolocation) {
                reject({ ok: false, message: "Location not supported by browser!" });
            } 
            else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({ ok: true, position: position });
                    },
                    (error) => {
                        reject({ ok: false, message: "Could not get location" });
                    }
                );
            }

        });
    }
    

    StartGettingLocation() {
        this.GetLocation();

        this.locationInterval = setInterval(() => {
            this.GetLocation();
        }, 60000); // slightly more to avoid errors from api
    }

    async SendLocationToApiAsync() {

        navigator.geolocation.getCurrentPosition((location) => {
            
            console.log("LOCATION:", location);

            if (!location) {
                console.error("Location is undefined!");
                return;
            }

            if (!location.coords) {
                console.error("Coords missing!", location);
                return;
            }
            const API_URL = `https://codecyprus.org/th/api/location?session=${this.session}&latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`;

            fetchData(API_URL).then((data) => {

                if (data.status === "OK") {
                    console.log(data.message);
                } 
                else {
                    const messageTMP = new Message(data.errorMessages);
                    messageTMP.Display();
                }

            });

        }, (error) => {
                const messageTMP = new Message(error.message);
                messageTMP.Display();
        });

        
    }
//#endregion

}


export const app = new App();


window.addEventListener("beforeunload", () => {
    console.log(app.currentQuestionIndex);
    app.SaveData();
});



export function SendLocationToAPI(position) {
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