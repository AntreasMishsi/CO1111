import { Stage } from './Stage.js';

import { Message } from '../Utils/Message.js';
import { RENDERED_AREA_ID, ClearRenderer } from '../Utils/ClearRenderer.js';
import { fetchData } from '../Utils/Utils.js';
import { ShareToTwitter } from '../Utils/ShareOnSocial.js';
import { AddLoadingAnimation, RemoveLoadingAnimation }  from '../Animations/Loading.js';

import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';


export class LeaderBoardStage extends Stage {

    constructor(app) {
        super(app); 
    }

    async OnStart() {
        FadeIn();
        this.app.parentStage.StopGettingLocation();
        const container = document.getElementById(RENDERED_AREA_ID);



        container.innerHTML = `
        
        <div class="leaderboard-wrapper">
            <h2 class="leaderboard-title">Leaderboard</h2>
            <div class="your-score-box">
                <span class="your-score-label">Name: ${this.app.name}</span>
                <span class="your-score-value">${this.app.score} pts</span>
            </div>
            <div class="leaderboard-controls">
            
                <button id="share-to-twitter-button" class="leaderboard-btn btn-with-icon"><img src="Resources/icons/x.svg"  alt="x-icon" />Share to X</button>
                <button id="loadLeaderboard" class="leaderboard-btn">Load Leaderboard</button>
            </div>
            <div id="leaderboard"></div>
            <button class="leaderboard-btn btn-with-icon" id="start-again-button"><img src="Resources/icons/refresh.svg"  alt="refresh-icon" />Start Again!</button>
        </div>

       
        
        `;
        document.getElementById("start-again-button").addEventListener("click", () => {
            this.app.Reset();
        });
        // Share button
        document.getElementById("share-to-twitter-button").addEventListener("click", () => {
            ShareToTwitter();
        });

        document.getElementById("loadLeaderboard").addEventListener("click", () => {


            this.DisplayLeaderBoard(30, "&sorted");

        });


        // share to other social buttons
        document.getElementById("share-to-twitter-button").addEventListener("click", () => {
            ShareToTwitter();
        });
    }

    DisplayLeaderBoard(limit, sorted) {

        const leaderboard_container = document.getElementById("leaderboard");

        const API_URL =
            `https://codecyprus.org/th/api/leaderboard?session=${this.app.session}${sorted}`;
        AddLoadingAnimation();
        fetchData(API_URL).then(data => {
            RemoveLoadingAnimation();

            if(data.status !== "OK"){
                const tmpMSG = new Message(data.errorMessages[0]);
                tmpMSG.Display();
                return;
            }

            const playerName = this.app.name;

            const playerIndex = data.leaderboard.findIndex(
                p => p.player === this.app.name
            );
            

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

                if (index === playerIndex) {
                    row.classList.add("highlight-row");
                }

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${player.player}</td>
                    <td>${player.score} pts</td>
               `;


                tableBody.appendChild(row);
            });

            if (playerIndex >= limit && playerIndex !== -1) {

                const player = data.leaderboard[playerIndex];

                const row = document.createElement("tr");
                
                row.classList.add("highlight-row");
                row.innerHTML = `
                    <td>${playerIndex + 1}</td>
                    <td>${player.player}</td>
                    <td>${player.score} pts</td>
                `;

                tableBody.appendChild(row);
            }

        });

        
    }

    async OnEnd() {
        await FadeOut();
        ClearRenderer();
    }
}
