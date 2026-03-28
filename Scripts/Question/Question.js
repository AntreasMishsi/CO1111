

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



    Display(parentId) {
        throw new Error("Abstract method 'Display' must be implemented by subclass");
    }

    Answear() {
        throw new Error("Abstract method 'Answear' must be implemented by subclass");
    }

    DisableButtons() {
        const skipButton = document.getElementById("skipButton");
        if(skipButton) {
            skipButton.disabled = true;
        }
       
        document.getElementById("submitAnswer").disabled = true;
    }

    Skip() {
        this.DisableButtons();
        this.parentStage.SkipQuestion();
    }
}
