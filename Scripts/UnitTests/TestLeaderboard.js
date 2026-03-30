import { AddLoadingAnimation, RemoveLoadingAnimation } from "../Animations/Loading.js";
import { Message } from "../Utils/Message.js";
import { fetchData } from "../Utils/Utils.js";

// copeid function from LeaderboardStage.js
function DisplayLeaderBoard(limit, sorted) {

        const leaderboard_container = document.getElementById("leaderboard");

        const API_URL = `https://codecyprus.org/th/test-api/leaderboard?${sorted}&size=${limit}`;
        AddLoadingAnimation();
        fetchData(API_URL).then(data => {
            RemoveLoadingAnimation();

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

const button = 

document.getElementById("loadLeaderboard").addEventListener("click", () => {
    let limit = parseInt(document.getElementById("x").value);
    if(!limit) {
        limit = 10;
    }
    const sortedChecked = document.getElementById("sorted").checked;
    const sorted = sortedChecked ? "&sorted" : "";

   

    DisplayLeaderBoard(limit, sorted);
});