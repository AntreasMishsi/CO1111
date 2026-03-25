import { Stage } from './Stage.js';

import { Message } from '../Utils/Message.js';
import { RENDERED_AREA_ID, ClearRenderer } from '../Utils/ClearRenderer.js';
import { fetchData } from '../Utils/Utils.js';
import { ShareToTwitter } from '../Utils/ShareOnSocial.js';

import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';


export class LeaderBoardStage extends Stage {

    constructor(app) {
        super(app); 
    }

    async OnStart() {
        FadeIn();
        const container = document.getElementById(RENDERED_AREA_ID);



        container.innerHTML = `
        <div style="text-align:center;">
            <h2>Leaderboard</h2>
            <div>
                <h2>Name: ${this.app.name}</h2>
                <h2>Score: ${this.app.score}</h2>
            </div>
            <div class="share-buttons-wrapper"> 
                <button id="share-to-twitter-button">ShareToTwitter</button>
            
            </div>
            
            
            <form>
            <input type="number" id="integerInput" name="integer_question" placeholder="Enter an integer number" step="1" oninput="this.value = Math.round(this.value);">
<!--            <input id="limit">-->
            <input type="checkbox" id="sorted">
            
            </form>

            <button id="loadLeaderboard" style="
                padding:10px 20px;
                font-size:16px;
                cursor:pointer;
                margin-bottom:20px;
            ">
                Load Leaderboard
            </button> 


            <div id="leaderboard"></div>
        </div>
        `;

        // Share button
        document.getElementById("share-to-twitter-button").addEventListener("click", () => {
            ShareToTwitter();
        });

        document.getElementById("loadLeaderboard").addEventListener("click", () => {

            // let limit = document.getElementById("limit").value;
            let sorted = document.getElementById("sorted").checked;

            let limit = document.getElementById("integerInput").value;
            let number = parseInt(limit); // Converts strings to integers
            
            if(sorted){
                sorted="&sorted";
            }else{
                sorted="";
            }

            this.DisplayLeaderBoard(limit, sorted);

        });


        // share to other social buttons
        document.getElementById("share-to-twitter-button").addEventListener("click", () => {
            ShareToTwitter();
        });
    }

    DisplayLeaderBoard(limit, sorted) {

        const leaderboard_container = document.getElementById("leaderboard");

        const API_URL =
            `https://codecyprus.org/th/api/leaderboard?session=${this.app.session}${sorted}&limit=${limit}`;

        fetchData(API_URL).then(data => {

            if(data.status !== "OK"){
                const tmpMSG = new Message(data.errorMessages[0]);
                tmpMSG.Display();
                return;
            }

            leaderboard_container.innerHTML = `
            <table style="
                width:100%;
                border-collapse:collapse;
                text-align:center;
                font-size:18px;
            ">
                <thead style="background:#333;color:white;">
                    <tr>
                        <th style="padding:10px;border:1px solid #ccc;">Rank</th>
                        <th style="padding:10px;border:1px solid #ccc;">Player</th>
                        <th style="padding:10px;border:1px solid #ccc;">Score</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body"></tbody>
            </table>
            `;
            const tableBody = document.getElementById("leaderboard-body");

            data.leaderboard.slice(0,limit).forEach((player, index) => {

                const row = document.createElement("tr");
                row.classList.add("fade-in");

                row.innerHTML = `
                <td style=" color:white;padding:10px;border:1px solid #ccc;">
                    ${index+1}
                </td>
                <td style="color:white;padding:10px;border:1px solid #ccc;">
                    ${player.player}
                </td>
                <td style="color:white;padding:10px;border:1px solid #ccc;">
                    ${player.score}
                </td>
                `;

                tableBody.appendChild(row);
            });

        });
    }

    async OnEnd() {
        await FadeOut();
        ClearRenderer();
    }
}
