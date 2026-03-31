import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FADE_OUT_DURATION, FadeOut } from "../Animations/AfterQuestionAnims.js";

import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
import { CloseScanner } from "../Utils/Scanner.js";

import { ClearRenderer, RENDERED_AREA_ID } from "../Utils/ClearRenderer.js";
import { Message } from "../Utils/Message.js";



export class BooleanQuestion extends Question {
    constructor(props) {
        super(props);
    }
    //render the html
    Display(parentId) {
        const container = document.getElementById(parentId);

        //get the navbar from parentstage
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
            const selected = document.querySelector(
                'input[name="boolean_question"]:checked',
            );
            if (!selected) {
                new Message("Please select an answer first").Display();
            }
            else {
                if(this.requiresLocation) {
                    this.AnswerWithLocation(selected.value === "true");
                }
                else {
                    this.Answear(selected.value === "true");
                }
            }
            
            
        });
        // add event listener to skip, if required
        if (this.canBeSkipped) {
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
        } 
        else {
            playCorrectAnimation(data.message); // if the answear is correct play the wrong animation
            this.parentStage.app.currentQuestionIndex++; // change the question index
        }
        await sleep(animationDuration); // sleep for the duration of animation
        this.parentStage.AskQuestion(); // go to the next question
    }
}
