import { app } from "../App/App.js";

import { Question } from "./Question.js";

import { playCorrectAnimation, playWrongAnimation, animationDuration, FadeOut } from "../Animations/AfterQuestionAnims.js";
import { fetchData } from "../Utils/Utils.js";
import { sleep } from "../Utils/Utils.js";
import { Message } from "../Utils/Message.js";
export class TextQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const API_SCORE = `https://codecyprus.org/th/api/score?session=${app.session}`;
        const container = document.getElementById(parentId);
        container.appendChild(this.parentStage.GenerateNavBar());
        // Render the form with radio buttons

        container.innerHTML += `
            <h2>Score: ${app.score}</h2>
            <div id="textForm" class="textForm">
                <p>${this.questionText}</p>
                <input type="text" id="textInput" class="textInput" name="text_question" placeholder="Enter your answer">
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
            </div>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            const input = document.getElementById("textInput").value.trim(); // Remove extra spaces

            if (input !== "") {
                this.Answear(input); // Pass the text to the Answer method
            } else {
                const tmpMSG = new Message("Please enter an answer.");
                tmpMSG.Display();
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
