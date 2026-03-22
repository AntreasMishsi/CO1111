import { app } from "../App/App.js";

import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FadeOut } from "../Animations/AfterQuestionAnims.js";
import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
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
        <h2>Score: ${app.score}</h2>
                <p>${this.questionText}</p>
                <input type="radio" id="A" name="mcq_question" value="A">
                <label for="A">A</label><br>
                <input type="radio" id="B" name="mcq_question" value="B">
                <label for="B">B</label><br>
                <input type="radio" id="C" name="mcq_question" value="C">
                <label for="C">C</label><br>
                <input type="radio" id="D" name="mcq_question" value="D">
                <label for="D">D</label><br>
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
            </div>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {

            const selected = document.querySelector('input[name="mcq_question"]:checked');
            this.Answear(selected.value);
        });
        if(this.canBeSkipped) {
            const skipButton = document.getElementById("skipButton");
            skipButton.addEventListener("click", () => {
                this.Skip();
            });
        }

    }


    async Answear(answear) {
        const API_URL_ANSWER = `https://codecyprus.org/th/api/answer?session=${app.session}&answer=${answear}`;

        // Promise that we will get the data
        const dataPromise = fetchData(API_URL_ANSWER);

        // start the animation
        await FadeOut();

        // wait till we get the data
        const data = await dataPromise;

        if (data.correct == false) {
            playWrongAnimation();
        } else {
            playCorrectAnimation();
        }

        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }


}
