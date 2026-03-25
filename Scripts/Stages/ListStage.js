import { Stage } from './Stage.js';

import { ClearRenderer } from '../Utils/ClearRenderer.js';
import { fetchData } from '../Utils/Utils.js';


import { Message } from '../Utils/Message.js';
import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';


const API_URL_LIST = 'https://codecyprus.org/th/api/list';




export class ListStage extends Stage {
    constructor(app) {
        super(app); 
    }
    
    async OnStart() {
        FadeIn();

        ClearRenderer();

        fetchData(API_URL_LIST).then (data => {
            const container = document.getElementById("rendered-area");

            const treasureHunts = data.treasureHunts;

            container.innerHTML = `
                <div class="TreasureHuntHeading">
                    <h1>Please select a Treasure Hunt</h1>
                </div>
                
                <form id="stageForm" class = "TreasureHuntForm">
                    <div id="treasure-hunt-list"></div>
                    <input type="submit" value="Submit" class="submit-button" id ="submit-btn">
                </form>
            
            `

            const listContainer = document.getElementById("treasure-hunt-list");
            const form = document.getElementById("stageForm");
            const submitBtn = document.getElementById("submit-btn");

           
            treasureHunts.forEach(th => {
                const now = new Date();
                const start = new Date(th.startsOn);
                const end = new Date(th.endsOn);

                let status = "active";
                if (now < start) status = "upcoming";
                if (now > end) status = "expired";

                const item = document.createElement("div");
                item.className = "treasure-hunt";

                item.innerHTML = `
                    <div class="th-content">
                        <h2 class="th-title">${th.name}</h2>
                        <p class="th-description">${th.description}</p>

                        <p class="th-dates">
                            From ${new Date(th.startsOn).toLocaleDateString()}
                            to ${new Date(th.endsOn).toLocaleDateString()}
                        </p>
                    </div>

                    <input type="radio"
                        class="th-radio"
                        name="treasure_hunt"
                        value="${th.uuid}"
                        data-name="${th.name}">
                `;

                if (status !== "active") {
                    item.classList.add("disabled");
                } 
                else {
                    item.addEventListener("click", () => {
                        item.querySelector(".th-radio").checked = true;

                        document.querySelectorAll(".treasure-hunt").forEach(box => {
                            box.classList.remove("selected");
                        });

                        item.classList.add("selected");
                    });
                }

                listContainer.appendChild(item);
            });
            
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                submitBtn.disabled = true;

                const selected = document.querySelector('input[name="treasure_hunt"]:checked');

                if (selected) {
                    const value = selected.value;

                    this.app.SetTreasureHuntID(value);
                    this.app.treasureHuntName = selected.dataset.name;

                } 
                else {
                    submitBtn.disabled = false;

                    const tmpMSG = new Message("Please select a treasure hunt");
                    tmpMSG.Display();
                }
            });


        });
        
    }

    async OnEnd() {
        await FadeOut();
        ClearRenderer();
    }
}