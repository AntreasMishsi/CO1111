import { initDots, setActiveDot, nextDot,getCurrentStep,updateScore } from '../progress-dots.js';
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


export class QuestionStage extends Stage {
    async OnStart() {
        initDots('progress-dots', app.numOfQuestions);
        const container = document.getElementById(RENDERED_AREA_ID);
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

    AskQuestion() {
        FadeIn();

        const API_URL_QUESTION = `https://codecyprus.org/th/api/question?session=${app.session}`;
        const API_URL_SCORE = `https://codecyprus.org/th/api/score?session=${app.session}`;


        const data = Promise.all([
            fetchData(API_URL_QUESTION),
            fetchData(API_URL_SCORE)])
            .then(([questionData, scoreData]) => {

                app.score = scoreData.score;
                updateScore(app.score);

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
                nextDot();
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
        document.getElementById('progress-dots').style.display = 'none';
        document.getElementById('question-label').style.display = 'none';
        document.getElementById('score-label').style.display = 'none';
    }
}