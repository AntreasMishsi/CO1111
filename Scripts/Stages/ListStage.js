import { Stage } from './Stage.js';

import { ClearRenderer } from '../Utils/ClearRenderer.js';
import { fetchData } from '../Utils/Utils.js';

import { app } from '../App/App.js';
import { Message } from '../Utils/Message.js';
import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';


const API_URL_LIST = 'https://codecyprus.org/th/api/list';


// todo remove later

class TreasureHunt {
    constructor({
                    uuid,
                    name,
                    description,
                    ownerEmail,
                    secretCode,
                    salt,
                    visibility,
                    startsOn,
                    endsOn,
                    maxDuration,
                    shuffled = false,
                    requiresAuthentication = false,
                    emailResults = false,
                    hasPrize = false
                } = {}) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.ownerEmail = ownerEmail;
        this.secretCode = secretCode;
        this.salt = salt;
        this.visibility = visibility;
        this.startsOn = startsOn;
        this.endsOn = endsOn;
        this.maxDuration = maxDuration;
        this.shuffled = shuffled;
        this.requiresAuthentication = requiresAuthentication;
        this.emailResults = emailResults;
        this.hasPrize = hasPrize;
    }

    Display(parent) {
        
        const container = document.createElement("div");
        container.className = "treasure-hunt";

        const now= new Date();
        const start = new Date(this.startsOn);
        const end= new Date (this.endsOn);

        let status="active";
        if(now < start) status = "upcoming";
        if(now > end) status = "expired";

        container.innerHTML = `
        <div class="th-content">
            <h2 class="th-title">${this.name}</h2>
            <p class="th-description">${this.description}</p>

            <p class="th-dates">
                From ${new Date(this.startsOn).toLocaleDateString()}
                to ${new Date(this.endsOn).toLocaleDateString()}
            </p>
        </div>

        <input type="radio" class="th-radio" name="treasure_hunt" value="${this.uuid}">
    `;
        if (status !== "active") {
            container.classList.add("disabled");
        }else {

            container.addEventListener("click", () => {
                container.querySelector(".th-radio").checked = true;

                document.querySelectorAll(".treasure-hunt").forEach(box => {
                    box.classList.remove("selected");
                });

                container.classList.add("selected");
            });
        }
        parent.appendChild(container);
    }


}

async function ListTruasureHunts() {
    ClearRenderer();
    const data = await fetchData(API_URL_LIST);
    const treasureHunts = data.treasureHunts.map(h => new TreasureHunt(h));

    const container = document.getElementById("rendered-area");
	container.className = "TreasureHuntList";
    container.classList.add("fade-in");

    //heading
    const heading=document.createElement("div");
    heading.className = "TreasureHuntHeading";
    heading.innerHTML = "Please select a Treasure Hunt";
    container.appendChild(heading);
    //crate form
    const form = document.createElement("form");
    form.id = "stageForm";
	form.className = "TreasureHuntForm";
    form.classList.add("fade-in");

    container.appendChild(form);

    container.className = "container-treasure-hunts";
    for(let i = 0; i < treasureHunts.length; i++) {
        treasureHunts[i].Display(form);
    }


    // Add submit button
    const submitBtn = document.createElement("input");
    submitBtn.className = "submit-btn";
    submitBtn.type = "submit";
    submitBtn.value = "Submit";
    form.appendChild(submitBtn);

    //Handle event for submitting
    document.getElementById("stageForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const selected = document.querySelector('input[name="treasure_hunt"]:checked');
        if (selected) {
            const value = selected.value;

            app.SetTreasureHuntID(value);

        } else {
            // TODO: add some event when nothing is selected
            const tmpMSG = new Message("Please select a treasure hunt");
            tmpMSG.Display();
        }

    });

}


export class ListStage extends Stage {
    async OnStart() {
        FadeIn();
        ListTruasureHunts();
    }

    async OnEnd() {
        await FadeOut();
        ClearRenderer();
    }
}