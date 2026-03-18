import { app } from "../App/App.js";

import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration } from "../Animations/AfterQuestionAnims.js";

import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";

export class BooleanQuestion extends Question {
    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const API_SCORE = `https://codecyprus.org/th/api/score?session=${app.session}`;
        const container = document.getElementById(parentId);
        // Render the form with radio buttons
        container.innerHTML = `
            <div class="booleanForm">
                    <h2>Score: ${app.score}</h2>
                    <p>${this.questionText}</p>
                    <input type="radio" id="true" name="boolean_question" value="true">
                    <label id="true1" for="true">True</label><br>
                    <input type="radio" id="false" name="boolean_question" value="false">
                    <label for="false">False</label><br>
                    <button type="button" id="submitAnswer">Submit</button>
                    ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ""}
            </div>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            const selected = document.querySelector(
                'input[name="boolean_question"]:checked',
            );
            this.Answear(selected.value === "true");
        });

        if (this.canBeSkipped) {
            const skipButton = document.getElementById("skipButton");
            skipButton.addEventListener("click", () => {
                this.Skip();
            });
        }
    }

    async Answear(answear) {
        const API_URL_ANSWER = `https://codecyprus.org/th/api/answer?session=${app.session}&answer=${answear}`;
        const data = fetchData(API_URL_ANSWER).then((data) => {
            console.log(data.correct);
            if (data.correct == false) {
                playWrongAnimation();
            } else {
                playCorrectAnimation();
            }
        });
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }
}
