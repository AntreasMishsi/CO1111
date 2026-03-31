import { Question } from "./Question.js";

import { fetchData } from "../Utils/Utils.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FadeOut, FADE_OUT_DURATION} from "../Animations/AfterQuestionAnims.js";

import { RENDERED_AREA_ID, ClearRenderer } from "../Utils/ClearRenderer.js";

import { sleep } from "../Utils/Utils.js";
import { Message } from "../Utils/Message.js";
import { CloseScanner } from "../Utils/Scanner.js";

export class IntegerQuestion extends Question {


    constructor(props) {
        super(props);
    }
    // reder the html
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

            // if the
            if (!isNaN(number)) {
                if(this.requiresLocation) {
                    this.AnswerWithLocation(number);
                }
                else {
                    this.Answear(number); 
                }
                
            } else {
                const tmpMSG = new Message("Please enter a valid integer.");
                tmpMSG.Display();
            }
        });

        // add event listener to skip, if required
        if(this.canBeSkipped) {
            const skipButton = document.getElementById("skipButton");
            skipButton.addEventListener("click", () => {
                CloseScanner();
                this.Skip();
            });
        }
    }

    //answear question
    async Answear(answear) {

        this.DisableButtons(); // disable buttons to avoid double api request
        const API_URL_ANSWER = `https://codecyprus.org/th/api/answer?session=${this.parentStage.app.session}&answer=${answear}`;

       
        // Promise that we will get the data
        const dataPromise = fetchData(API_URL_ANSWER); // simple optimisation so data request runs parallel with animation


        // start the animation
        await FadeOut();
        ClearRenderer(); // remove all the html after the animation
        CloseScanner(); // close the camera
        // wait till we get the data
        const data = await dataPromise; // when we get the data we can continue

        if (data.correct == false) {
            playWrongAnimation(data.message); // if the answear is incorrect play the wrong animation
        } else {
            playCorrectAnimation(data.message); // if the answear is correct play the wrong animation
            this.parentStage.app.currentQuestionIndex++; // change the question index
        }

        await sleep(animationDuration); // sleep for the duration of animation
        this.parentStage.AskQuestion(); // go to the next question
    }
}
