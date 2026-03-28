import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FADE_OUT_DURATION, FadeOut } from "../Animations/AfterQuestionAnims.js";

import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
import { CloseScanner } from "../Utils/Scanner.js";

import { RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

export class BooleanQuestion extends Question {
    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const container = document.getElementById(parentId);

        container.appendChild(this.parentStage.GenerateNavBar());
        // Render the form with radio buttons
        container.innerHTML += `
            <div id="booleanForm" class="booleanForm">
                    <p>${this.questionText}</p>
                    <input type="radio" id="true" name="boolean_question" value="true">
                    <label id="true1" for="true">True</label>
                    <input type="radio" id="false" name="boolean_question" value="false">
                    <label for="false">False</label>
                    <button type="button" id="submitAnswer">Submit</button>
                    ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ""}
            </div>
        `;
        // go through all a and make it so they all open another page
        container.querySelectorAll("a").forEach(a => {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
        });

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            submitButton.disabled = true;
            const selected = document.querySelector(
                'input[name="boolean_question"]:checked',
            );
            this.Answear(selected.value === "true");
        });

        if (this.canBeSkipped) {
            const skipButton = document.getElementById("skipButton");
            skipButton.addEventListener("click", () => {
                CloseScanner();
                this.Skip();
            });
        }
    }

    async Answear(answear) {
        const API_URL_ANSWER = `https://codecyprus.org/th/api/answer?session=${this.parentStage.app.session}&answer=${answear}`;
        

        if(this.requiresLocation) {
            await this.parentStage.app.SendLocationToApiAsync();
        }
        // Promise that we will get the data
        const dataPromise = fetchData(API_URL_ANSWER);

        // start the animation
        await FadeOut();
        CloseScanner();
        // wait till we get the data
        const data = await dataPromise;

        if (data.correct == false) {
            playWrongAnimation(data.message);
        } 
        else {
            playCorrectAnimation(data.message);
        }

        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }
}
