import { app } from '../App/App.js';
import { Stage } from './Stage.js';
import { Message } from '../Utils/Message.js';
import { RENDERED_AREA_ID, ClearRenderer } from '../Utils/ClearRenderer.js';
import { fetchData } from '../Utils/Utils.js';
import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';

export class LeaderBoardStage extends Stage {
    async OnStart() {
        FadeIn();
        const container = document.getElementById(RENDERED_AREA_ID);

        container.innerHTML = `
    <div class="leaderboard-wrapper">
        <div class="your-score-box">
            <span class="your-score-label">You scored</span>
            <span class="your-score-value">${app.score} pts</span>
        </div>
        <h2 class="leaderboard-title">Leaderboard</h2>
        <button id="loadLeaderboard" class="leaderboard-btn">Load Leaderboard</button>
        <div id="leaderboard"></div>
    </div>
`;

        document.getElementById("loadLeaderboard").addEventListener("click", () => {
            this.DisplayLeaderBoard();
        });
    }

    DisplayLeaderBoard() {
        const leaderboard_container = document.getElementById("leaderboard");
        const API_URL = `https://codecyprus.org/th/api/leaderboard?session=${app.session}&sorted&limit=1000000000000000000000`;

        fetchData(API_URL).then(data => {
            console.log(data);
            if (data.status !== "OK") {
                const tmpMSG = new Message(data.errorMessages[0]);
                tmpMSG.Display();
                return;
            }

            leaderboard_container.innerHTML = `
                <table class="lb-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Player</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody id="lb-body"></tbody>
                </table>
            `;

            const tbody = document.getElementById("lb-body");
            data.leaderboard.forEach((player, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${player.player}</td>
                    <td>${player.score} pts</td>
                `;
                tbody.appendChild(row);
            });
        });
    }

    async OnEnd() {
        await FadeOut();
        ClearRenderer();
    }
}