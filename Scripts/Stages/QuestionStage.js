import { app } from '../App/App.js';
import { Stage } from './Stage.js';

import { RENDERED_AREA_ID } from '../Utils/ClearRenderer.js'
import { fetchData } from "../Utils/Utils.js";
import { Message } from '../Utils/Message.js';
import { ClearRenderer } from '../Utils/ClearRenderer.js';


//Questions
import { IntegerQuestion } from '../Question/IntegerQuestion.js';
import { BooleanQuestion } from '../Question/BooleanQuestion.js';
import { NumericQuestion } from '../Question/NumericQuestion.js';
import { MCQQuestion } from '../Question/MCQQuestion.js';
import { TextQuestion } from '../Question/TextQuestion.js';

import { FadeIn, FadeOut } from '../Animations/AfterQuestionAnims.js';
// User A - stated that he would like to see his nickname during question stage

export class QuestionStage extends Stage {


    async OnStart() {

        

        



        const container = document.getElementById(RENDERED_AREA_ID);
        app.StartGettingLocation();

        this.QuestionTypes = {
            "INTEGER": IntegerQuestion,
            "BOOLEAN": BooleanQuestion,
            "NUMERIC": NumericQuestion,
            "MCQ": MCQQuestion,
            "TEXT": TextQuestion,
        };

        if (app.currentQuestionData) {
            const questionClass = this.QuestionTypes[app.currentQuestionData.questionType];
            const question = new questionClass({...app.currentQuestionData, parentStage: this});
            question.Display(RENDERED_AREA_ID);
        } else {
            this.AskQuestion();
        }
        
    }

    GenerateNavBar() {
        const navbar = document.createElement("div");

        navbar.id = "question-stage-navbar";

        navbar.innerHTML = `
            <h2>Name: ${app.name}</h2>
            <h2>Score: ${app.score}</h2>
        `
        return navbar;
    }

    AskQuestion() {
        
        

        const API_URL_QUESTION = `https://codecyprus.org/th/api/question?session=${app.session}`;
        const API_URL_SCORE = `https://codecyprus.org/th/api/score?session=${app.session}`;


        const data = Promise.all([
            fetchData(API_URL_QUESTION),
            fetchData(API_URL_SCORE)])
            .then(([questionData, scoreData]) => {

                app.score = scoreData.score;

                if(questionData.completed === true){
                    app.ChangeStage();
                    return;
                }


                if(questionData.status !== "OK") {
                    console.log(questionData.errorMessages[0]);
                    const tmpMSG = new Message(questionData.errorMessages[0]);
                    tmpMSG.Display();
                }
                else {
                    ClearRenderer();
                    app.SaveData();

                    FadeIn();
                    
                    app.currentQuestionData = questionData;
                    
                    const questionClass = this.QuestionTypes[questionData.questionType];
                    app.currentQuestion = questionClass;
                    const question = new questionClass({...questionData, parentStage: this});

                    
                    
                    question.Display(RENDERED_AREA_ID);
                    
                }
            });
    }

    SkipQuestion() {
        const API_URL_SKIP_QUESTION = `https://codecyprus.org/th/api/skip?session=${app.session}`;
        const data = fetchData(API_URL_SKIP_QUESTION).then(data => {
            if(data.status === "OK") {
                ClearRenderer();
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
        await FadeOut();
        ClearRenderer();
    }
}