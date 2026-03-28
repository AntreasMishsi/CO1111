import { Stage } from './Stage.js';

import { RENDERED_AREA_ID } from '../Utils/ClearRenderer.js'
import { fetchData } from "../Utils/Utils.js";
import { Message } from '../Utils/Message.js';
import { ClearRenderer } from '../Utils/ClearRenderer.js';
import { ChangeCamera, CloseScanner, OpenScanner } from '../Utils/Scanner.js';


//Questions
import { IntegerQuestion } from '../Question/IntegerQuestion.js';
import { BooleanQuestion } from '../Question/BooleanQuestion.js';
import { NumericQuestion } from '../Question/NumericQuestion.js';
import { MCQQuestion } from '../Question/MCQQuestion.js';
import { TextQuestion } from '../Question/TextQuestion.js';

import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';
// User A - stated that he would like to see his nickname during question stage

export class QuestionStage extends Stage {
    constructor(app) {
        super(app); 
    }

    async OnStart() {
        this.app.currentQuestionIndex = 1;
        document.getElementById('scan-btn').style.display = 'flex';
        document.getElementById('leaderboard-btn').style.display = 'flex';
        
        
        const container = document.getElementById(RENDERED_AREA_ID);
        this.app.StartGettingLocation();

        this.QuestionTypes = {
            "INTEGER": IntegerQuestion,
            "BOOLEAN": BooleanQuestion,
            "NUMERIC": NumericQuestion,
            "MCQ": MCQQuestion,
            "TEXT": TextQuestion,
        };

        if (this.app.currentQuestionData) {
            const questionClass = this.QuestionTypes[this.app.currentQuestionData.questionType];
            const question = new questionClass({...this.app.currentQuestionData, parentStage: this});
            question.Display(RENDERED_AREA_ID);
        } else {
            this.AskQuestion();
        }
        
    }

    GenerateNavBar() {
        const navbar = document.createElement("div");
        navbar.id = "question-stage-navbar";

        navbar.innerHTML = `
        <div class="navbar-wrapper">
            <h2>Name: ${this.app.name}</h2>
            <h2>Score: ${this.app.score}</h2>
            <p>Question ${this.app.currentQuestionIndex} of ${this.app.numOfQuestions}</p>
        </div>

        
    `
        return navbar;
    }

    AskQuestion() {

        const API_URL_QUESTION = `https://codecyprus.org/th/api/question?session=${this.app.session}`;
        const API_URL_SCORE = `https://codecyprus.org/th/api/score?session=${this.app.session}`;


        const data = Promise.all([
            fetchData(API_URL_QUESTION),
            fetchData(API_URL_SCORE)])
            .then(([questionData, scoreData]) => {

                this.app.score = scoreData.score;

                if(questionData.completed === true){
                    CloseScanner();
                    this.app.ChangeStage();
                    return;
                }


                if(questionData.status !== "OK") {
                    console.log(questionData.errorMessages[0]);
                    const tmpMSG = new Message(questionData.errorMessages[0]);
                    tmpMSG.Display();
                }
                else {
                    
                    ClearRenderer();
                    this.app.SaveData();
                    FadeIn();

                    

                    this.app.currentQuestionData = questionData;
                    
                    const questionClass = this.QuestionTypes[questionData.questionType];
                    this.app.currentQuestion = questionClass;
                    const question = new questionClass({...questionData, parentStage: this});

                    
                    
                    question.Display(RENDERED_AREA_ID);

                    document.getElementById("open-camera-button").addEventListener("click", () => {
                        OpenScanner();
                    });
                    document.getElementById("change-camera-button").addEventListener("click", () => {
                        ChangeCamera();
                    });
                    

                }
            });
    }

    SkipQuestion() {
        const API_URL_SKIP_QUESTION = `https://codecyprus.org/th/api/skip?session=${this.app.session}`;
        
        const data = fetchData(API_URL_SKIP_QUESTION).then(data => {
            if(data.status === "OK") {
                CloseScanner();
                ClearRenderer();
                this.app.currentQuestionIndex++;
                this.AskQuestion();
                
            }
            else {
                
                console.log(data.errorMessages[0]);
                const tmpMSG = new Message(data.errorMessages[0]);
                tmpMSG.Display();
            }
        });

    }

    async OnEnd() {
        const label = document.getElementById('question-label');
        if (label) label.textContent = '';
        document.getElementById('scan-btn').style.display = 'none';
        document.getElementById('leaderboard-btn').style.display = 'none';
        await FadeOut();
        ClearRenderer();
    }
}

