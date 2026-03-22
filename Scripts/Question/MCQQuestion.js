import { nextDot } from '../progress-dots.js';
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
        container.innerHTML = `
            <div class="question-card">
                <p class="question-text">${this.questionText}</p>
                <div class="option-group">
                    <div class="option-btn" data-value="A">A</div>
                    <div class="option-btn" data-value="B">B</div>
                    <div class="option-btn" data-value="C">C</div>
                    <div class="option-btn" data-value="D">D</div>
                </div>
                <div class="question-buttons">
                    <button type="button" id="submitAnswer" class="btn-submit">Submit</button>
                    ${this.canBeSkipped ? `<button type="button" id="skipButton" class="btn-skip">Skip</button>` : ''}
                </div>
            </div>
        `;

        let selected = null;
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selected = btn.dataset.value;
            });
        });

        document.getElementById('submitAnswer').addEventListener('click', () => {
            if (selected !== null) this.Answear(selected);
        });

        if (this.canBeSkipped) {
            document.getElementById('skipButton').addEventListener('click', () => {
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