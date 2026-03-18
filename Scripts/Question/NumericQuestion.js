import { app } from "../App/App.js";

import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration } from "../Animations/AfterQuestionAnims.js";
import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
export class NumericQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {

        const container = document.getElementById(parentId);
        // Render the form with radio buttons
        container.innerHTML = `
        <h2>Score: ${app.score}</h2>
            <div id="integerForm">
                <p>${this.questionText}</p>
                <input type="number" id="numericInput" name="numeric_question" placeholder="Enter a number">
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
            </div>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            const input = document.getElementById("numericInput").value;
            const number = parseFloat(input); // Convert string to float

            if (!isNaN(number)) {
                this.Answear(number); // Pass the float to the Answer method
            } else {
                alert("Please enter a valid number.");
            }


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
        const data = fetchData(API_URL_ANSWER).then(data => {
            console.log(data.correct);
            if(data.correct == false) {
                playWrongAnimation();
            }
            else {
                playCorrectAnimation();
            }

        });
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }



}
