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
    <div class="leaderboard-wrapper">
        <h2 class="leaderboard-title">Leaderboard</h2>
        <div class="your-score-box">
            <span class="your-score-label">Name: ${this.app.name}</span>
            <span class="your-score-value">${this.app.score} pts</span>
        </div>
        <div class="leaderboard-controls">
            <input type="number" id="integerInput" class="leaderboard-input" placeholder="How many players" step="1" oninput="this.value = Math.round(this.value);">
            <button id="share-to-twitter-button" class="leaderboard-btn">Share to Twitter</button>
            <button id="loadLeaderboard" class="leaderboard-btn">Load Leaderboard</button>
        </div>
        <div id="leaderboard"></div>
    </div>
`;

        // Share button
        document.getElementById("share-to-twitter-button").addEventListener("click", () => {
            ShareToTwitter();
        });

        document.getElementById("loadLeaderboard").addEventListener("click", () => {

            // let limit = document.getElementById("limit").value;
            let sorted = "&sorted";

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
                <table class="lb-modal-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Score</th>
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
                    <td>${index + 1}</td>
                    <td>${player.player}</td>
                    <td>${player.score} pts</td>
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
