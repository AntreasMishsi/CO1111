import { Question } from "./Question.js";

import { fetchData } from "../Utils/Utils.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FadeOut, FADE_OUT_DURATION} from "../Animations/AfterQuestionAnims.js";

import { RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";

import { sleep } from "../Utils/Utils.js";
import { Message } from "../Utils/Message.js";
import { CloseScanner } from "../Utils/Scanner.js";

export class IntegerQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const container = document.getElementById(parentId);


        container.appendChild(this.parentStage.GenerateNavBar());

        // Render the form with radio buttons
        container.innerHTML += `
            <div id="integerForm" class="integerForm">
                <p>${this.questionText}</p>
                <input type="number" id="integerInput" class="integerInput" name="integer_question" placeholder="Enter an integer number" step="1" oninput="this.value = Math.round(this.value);">
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
            const input = document.getElementById("integerInput").value;
            const number = parseInt(input, 10); // Convert string to integer
            if (!isNaN(number)) {
                this.Answear(number); // Pass the integer to the Answer method
            } else {
                const tmpMSG = new Message("Please enter a valid integer.");
                tmpMSG.Display();
            }
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
            this.parentStage.app.currentQuestionIndex++;
        }
        console.log(animationDuration);
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }
}
