import { Stage } from './Stage.js';

//utils
import { ClearRenderer, RENDERED_AREA_ID } from '../Utils/ClearRenderer.js';
import { fetchData } from '../Utils/Utils.js';
import { Message } from '../Utils/Message.js';
import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';
import { AddLoadingAnimation, RemoveLoadingAnimation } from '../Animations/Loading.js';
//stage where you enter you nickname
export class StartStage extends Stage {

    constructor(app) {
        super(app); 
    }

    async OnStart() {
        this.UnlockAllButtons(); // unlock all buttons
        FadeIn();
        const container = document.getElementById(RENDERED_AREA_ID);
        //render html
        container.innerHTML = `
        <div class="form-container fade-in">
                <div class="forms start-form">
                    <form id="startForm">
                        <div class="Name">
                            <h1>Enter your name to start Hunting</h1>
                        </div>
                        <input class="surname" id="nickname-field" type="text" name="Firstname" placeholder="Name">
                        <input class="submit-btn" type="submit" name="Submit" placeholder="Submit" id="submit-name-button">
                    </form>
                    
                </div>
        </div>
		`
        
        // add event listener
        document.getElementById("startForm").addEventListener("submit", (event) => {
            event.preventDefault();

            const nickname = document.getElementById("nickname-field").value; // get value from nickname field
            this.LockAllButtons(); // lock all buttons to avoid double api requests

            const API_URL_START = `https://codecyprus.org/th/api/start?player=${nickname}&app=TreasureHuntApp&treasure-hunt-id=${this.app.treasureHuntID}`;
            AddLoadingAnimation(); // add loading animation

            const data = fetchData(API_URL_START).then(data => {
                RemoveLoadingAnimation(); // remove loading anumation
                if(data.status === "OK") {
                    this.app.session = data.session;
                    this.app.numOfQuestions = data.numOfQuestions;
                    this.app.name = nickname;
                    // if everything ok move on to next stage and save data
                    this.app.SaveData();
                    this.app.ChangeStage();
                }
                else {

                    this.UnlockAllButtons(); // unlock button because we will need to make another api requests

                    // notify user that something went wrong
                    console.log(data.errorMessages[0]);
                    const tmpMSG = new Message(data.errorMessages[0]);
                    tmpMSG.Display();
                }

            });

        });


    }

    async OnEnd() {
        this.LockAllButtons();
        await FadeOut();
        ClearRenderer();
    }
}
