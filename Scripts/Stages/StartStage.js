

import { app } from '../App/App.js';
import { Stage } from './Stage.js';

//utils
import { ClearRenderer, RENDERED_AREA_ID } from '../Utils/ClearRenderer.js';
import { fetchData } from '../Utils/Utils.js';
import { Message } from '../Utils/Message.js';

export class StartStage extends Stage {
    OnStart() {

        const container = document.getElementById(RENDERED_AREA_ID);

        container.innerHTML = `
        <div class="form-container fade-in">
                <div class="forms">
                    <form id="startForm">
                        <div class="Name">
                            <h1>Enter your Name</h1>
                        </div>
                        <input class="surname" id="nickname-field" type="text" name="Firstname" placeholder="Name"><br><br>
                        <input class="submit-btn" type="submit" name="Submit" placeholder="Submit"><br><br>
                    </form>
                    <button class="load-data-button" id="load-data-buttton">Load data</button>
                </div>
        </div>
		`
        
        document.getElementById("load-data-buttton").addEventListener("click", function(event) {
            app.LoadCookies();
        });

        document.getElementById("startForm").addEventListener("submit", function(event) {
            event.preventDefault();

            const nickname = document.getElementById("nickname-field").value;

            const API_URL_START = `https://codecyprus.org/th/api/start?player=${nickname}&app=TreasureHuntApp&treasure-hunt-id=${app.treasureHuntID}`;
            const data = fetchData(API_URL_START).then(data => {
                if(data.status === "OK") {
                    app.session = data.session;
                    app.numOfQuestions = data.numOfQuestions;
                    app.name = nickname;
                    
                    app.SaveData();
                    app.ChangeStage();
                }
                else {
                    console.log(data.errorMessages[0]);
                    const tmpMSG = new Message(data.errorMessages[0]);
                    tmpMSG.Display();
                }

            });

        });


    }

    OnEnd() {
        ClearRenderer();
    }
}
