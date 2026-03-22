import { nextDot } from '../progress-dots.js';
import { app } from "../App/App.js";
import { Question } from "./Question.js";
import { playCorrectAnimation, playWrongAnimation, animationDuration, FadeOut } from "../Animations/AfterQuestionAnims.js";
import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
import { Message } from "../Utils/Message.js";

export class NumericQuestion extends Question {
    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const container = document.getElementById(parentId);
        container.innerHTML = `
            <div class="question-card">
                <p class="question-text">${this.questionText}</p>
                <input class="question-input" type="number" id="numericInput" placeholder="Enter a number">
                <div class="question-buttons">
                    <button type="button" id="submitAnswer" class="btn-submit">Submit</button>
                    ${this.canBeSkipped ? `<button type="button" id="skipButton" class="btn-skip">Skip</button>` : ''}
                </div>
            </div>
        `;

        document.getElementById("submitAnswer").addEventListener("click", () => {
            const input = document.getElementById("numericInput").value;
            const number = parseFloat(input);
            if (!isNaN(number)) {
                this.Answear(number);
            } else {
                const tmpMSG = new Message("Please enter a valid number.");
                tmpMSG.Display();
            }
        });

        if (this.canBeSkipped) {
            document.getElementById("skipButton").addEventListener("click", () => {
                this.Skip();
            });
        }
    }

    async Answear(answear) {
        const API_URL_ANSWER = `https://codecyprus.org/th/api/answer?session=${app.session}&answer=${answear}`;
        const dataPromise = fetchData(API_URL_ANSWER);
        await FadeOut();
        const data = await dataPromise;
        if (data.correct == false) {
            playWrongAnimation();
        }
        else {
            playCorrectAnimation();
            nextDot();
        }
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }
}