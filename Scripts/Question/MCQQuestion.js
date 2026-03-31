import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FadeOut } from "../Animations/AfterQuestionAnims.js";

import { ClearRenderer } from "../Utils/ClearRenderer.js";
import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
import { CloseScanner } from "../Utils/Scanner.js";
import { Message } from "../Utils/Message.js";

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

            // check for validity
            // the answear it
            if(selected) {
                if (this.requiresLocation) {
                    this.AnswerWithLocation(selected.value);
                } else {
                    this.Answer(selected.value);
                }
            }
            else {
                new Message("Please select an answer.").Display();
            }

            
        });

        // if question can be skipped add event listener
        if(this.canBeSkipped) {
            const skipButton = document.getElementById("skipButton");
            skipButton.addEventListener("click", () => {
                CloseScanner();
                this.Skip();
            });
        }

    }


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
        const data = await dataPromise;  // when we get the data we can continue

        if (data.correct == false) {
            playWrongAnimation(data.message);  // if the answear is incorrect play the wrong animation
        } else {
            playCorrectAnimation(data.message); // if the answear is correct play the wrong animation
            this.parentStage.app.currentQuestionIndex++; // change the question index
        }

        await sleep(animationDuration); // sleep for the duration of animation
        this.parentStage.AskQuestion(); // go to the next question
    }


}
