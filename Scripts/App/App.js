
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

// this is the main manager of the web app
// it controls the flow of the application
// apllication consistes out 4 stages: List, Start, Questions, LeaderBoard
export class App {
    constructor() {
        this.session = null; // store the session paremeter given by api
        this.name = null;   // name of the player


        this.treasureHuntName = null; // name of the selected treasure hunt
        this.treasureHuntID = null; // id of the selected treasure hunt

        this.score = 0; // intialize the score of the player

        this.currentQuestion = null;
        this.currentQuestionIndex = 0; // index of the current question
        this.numOfQuestions = 0;    // total number of questions
        this.currentQuestionData = null; // store the data of the current question

        this.curentTime = Date.now(); // time when treasure hunt started

        this.appState = new AppState(); //manager of states of the app

        // stages of the
        this.StageList = [
            new ListStage(this), //
            new StartStage(this),
            new QuestionStage(this),
            new LeaderBoardStage(this),
        ];
        // load cookies
        this.LoadCookies();
        
        console.log(this.session);
        // if cookie was not complete start the aplication
        if(!this.session || !this.name) {
            this.appState.setStage(Stages.List);
            this.StageList[this.appState.getCurentStage()].OnStart();
        }
    }
    // change stage of the app
    async ChangeStage() {
        await this.StageList[this.appState.getCurentStage()].OnEnd(); // wait till the previous stage ends, ussualy just fade out animation
        
        this.appState.nextStage(); // go to next stage
        await this.StageList[this.appState.getCurentStage()].OnStart(); // start the next stage
    }
    

    Reset() {
        // reset all the values
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

        this.locationInterval = null;
        

        this.appState = new AppState();
        // delete the cookie
        document.cookie = "app=; max-age=0; path=/;";

        this.appState.setStage(Stages.List);
        // start from list again
        this.StageList[this.appState.getCurentStage()].OnStart();
    }

//#region Cookies
    // save the cookies
    SaveData() {
        // all data we need saved
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
        // put in the cookies
        document.cookie = "app=" + JSON.stringify(data) + "; path=/";
    }

    LoadCookies() {
        let cookies = document.cookie.split("; ");

        console.log("Load cookie");

        for (let c of cookies) {
            let parts = c.split("=");
            let key = parts.shift();
            let value = parts.join("=");
            // find out cookie
            if (key === "app") {

                let data = JSON.parse(value);
                console.log(data);
                if(!data) return; // if cookies is not complete  dont load it
                if(data.session === null) { // if cookies is not complete  dont load it
                    break;
                }
                if(data.name === null) { // if cookies is not complete  dont load it
                    break;
                }
                const SESSION_TIME = 30 * 60 * 1000;
                console.log(data);
                // if session expired reset everything
                if (!data.timestamp || (Date.now() - data.timestamp > SESSION_TIME)) {
                    console.log("Cookie expired (more than 30 minutes)");
                    
                    this.Reset();
                    break;
                }

                // load the cookie data into app
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

    // when we have treasure hunt id we can move on to the next stage
    SetTreasureHuntID(id) {
        this.treasureHuntID = id;
        console.log(this.treasureHuntID);
        this.ChangeStage();
    }



//#region location
    // function to get location
    GetLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(SendLocationToAPI, ErrorGettingLocation);
        }
        else {
            const messageTMP = new Message("Location not supported by browser!");
            messageTMP.Display();
        }
    }


    

    StartGettingLocation() {
        this.GetLocation();

        this.locationInterval = setInterval(() => {
            this.GetLocation();
        }, 60000); // slightly more to avoid errors from api
    }
    StopGettingLocation() {
        if (this.locationInterval) {
            clearInterval(this.locationInterval);
            this.locationInterval = null;
            console.log("Stopped getting location");
        }
    }


//#endregion

}

// initialize app
export const app = new App();

// before unloading the page save data
window.addEventListener("beforeunload", () => {
    console.log(app.currentQuestionIndex);
    app.SaveData();
});


// send location to treasure hunt api
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
// if can not get notify the user
function ErrorGettingLocation() {
    const messageTMP = new Message("Could not get location");
    messageTMP.Display();
}