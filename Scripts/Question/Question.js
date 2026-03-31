import { SendLocationToAPI } from "../App/App.js";
import { Message } from "../Utils/Message.js";

// base class of question
export class Question {
    constructor({
                    // data that is return by api for question
                    status,
                    completed,
                    questionText,
                    questionType,
                    canBeSkipped,
                    requiresLocation,
                    numOfQuestions,
                    currentQuestionIndex,
                    correctScore,
                    wrongScore,
                    skipScore,

                    //data that is needed for the question but is not returned by api
                    parentStage = null,
                    score = 0,

                } = {}) {
        this.status = status;
        this.completed = completed;
        this.questionText = questionText;
        this.questionType = questionType;
        this.canBeSkipped = canBeSkipped;
        this.requiresLocation = requiresLocation;
        this.numOfQuestions = numOfQuestions;
        this.currentQuestionIndex = currentQuestionIndex;
        this.correctScore = correctScore;
        this.wrongScore = wrongScore;
        this.skipScore = skipScore;

        this.parentStage = parentStage;
        this.score = score;
    }


    // a method which will render the html
    Display(parentId) {
        throw new Error("Abstract method 'Display' must be implemented by subclass");
    }

    // answer method for questions that require location
    async AnswerWithLocation(answear) {
        this.DisableButtons(); // diable buttons to avoid double api request
        navigator.geolocation.getCurrentPosition(async (position) => {
            // if can get geolocation
            await SendLocationToAPI(position); // send the data geolocation to api
            await this.Answear(answear); // after answear the question
        },
        (err) => {
            // if we cannot get the location notify the user
            console.log("Error");
            new Message("Location now available").Display();
            this.UnlockButtons();
        }
        
        );
    }
    // abstract method for answering question
    Answear(answear) {
        throw new Error("Abstract method 'Answear' must be implemented by subclass");
    }
    // disable buttons to avoid double requests
    DisableButtons() {
        const skipButton = document.getElementById("skipButton");
        if(skipButton) {
            skipButton.disabled = true;
        }
       
        document.getElementById("submitAnswer").disabled = true;
    }
    // unlocks the buttons if th
    UnlockButtons() {
        const skipButton = document.getElementById("skipButton");
        if(skipButton) {
            skipButton.disabled = false;
        }
       
        document.getElementById("submitAnswer").disabled = false;
    }

    Skip() {
        this.DisableButtons();
        this.parentStage.SkipQuestion();
    }
}
