


import { FadeIn } from "../Animations/AfterQuestionAnims.js";
import { ClearRenderer } from "../Utils/ClearRenderer.js";

import {AddLoadingAnimation, RemoveLoadingAnimation} from "../Animations/Loading.js";
import { fetchData } from "../Utils/Utils.js";

// function copied from ListStage.js

function testList(limit) {
            const API_URL_LIST = `https://codecyprus.org/th/test-api/list?number-of-ths=${limit}`;
            FadeIn();
            ClearRenderer();

            AddLoadingAnimation();

            fetchData(API_URL_LIST).then (data => {
                RemoveLoadingAnimation();
                const container = document.getElementById("rendered-area");
    
                const treasureHunts = data.treasureHunts;
    
                container.innerHTML = `
                    <div class="TreasureHuntHeading">
                        <h1>Please select a Treasure Hunt</h1>
                    </div>
                    
                    <form id="stageForm" class = "TreasureHuntForm">
                        <div id="treasure-hunt-list"></div>
                        
                    </form>
                
                `
    
                const listContainer = document.getElementById("treasure-hunt-list");
                const form = document.getElementById("stageForm");
                const submitBtn = document.getElementById("submit-btn");
    
               
                treasureHunts.forEach(th => {
                    const now = new Date();
                    const start = new Date(th.startsOn);
                    const end = new Date(th.endsOn);
                    console.log(start);
                    console.log(end);
                    
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
        });
}


testList(1);

document.getElementById("load-button").addEventListener("click", function () {
        let value = document.getElementById("x").value;
        if(value) {
            testList(value);
        }
});