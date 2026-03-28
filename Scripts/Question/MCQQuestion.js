import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FadeOut } from "../Animations/AfterQuestionAnims.js";

import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
import { CloseScanner } from "../Utils/Scanner.js";

// Tester C didnt select any of ABCD options, and the app dint notify him
export class MCQQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {

        const container = document.getElementById(parentId);

        container.appendChild(this.parentStage.GenerateNavBar());
        // Render the form with radio buttons
        container.innerHTML += `
<div class="mcqForm">
                <p>${this.questionText}</p>
                <div class="radio-wrapper">
                <input type="radio" id="A" name="mcq_question" value="A">
                <label for="A">A</label>
                <input type="radio" id="B" name="mcq_question" value="B">
                <label for="B">B</label>
                <input type="radio" id="C" name="mcq_question" value="C">
                <label for="C">C</label>
                <input type="radio" id="D" name="mcq_question" value="D">
                <label for="D">D</label>
                </div>
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
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

            const selected = document.querySelector('input[name="mcq_question"]:checked');
            this.Answear(selected.value);
        });
        if(this.canBeSkipped) {
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
        } else {
            playCorrectAnimation(data.message);
        }

        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }


}
