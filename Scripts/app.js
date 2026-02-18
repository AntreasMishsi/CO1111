
/* Constants*/ 
const API_URL_LIST = 'https://codecyprus.org/th/api/list';

const RENDERED_AREA_ID = 'rendered-area';

const Stages = {
	List: 0,
	Start: 1,
	Question: 2,
	LeaderBoard: 3
}




class TreasureHunt {
    constructor({
        uuid,
        name,
        description,
        ownerEmail,
        secretCode,
        salt,
        visibility,
        startsOn,
        endsOn,
        maxDuration,
        shuffled = false,
        requiresAuthentication = false,
        emailResults = false,
        hasPrize = false
    } = {}) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.ownerEmail = ownerEmail;
        this.secretCode = secretCode;
        this.salt = salt;
        this.visibility = visibility;
        this.startsOn = startsOn;
        this.endsOn = endsOn;
        this.maxDuration = maxDuration;
        this.shuffled = shuffled;
        this.requiresAuthentication = requiresAuthentication;
        this.emailResults = emailResults;
        this.hasPrize = hasPrize;
    }

    Display(parent) {
        const container = document.createElement("div");
        container.className = "treasure-hunt";
        
        container.innerHTML = `
            <h2>${this.name}</h2>
            <p>${this.description}</p>
            
            <p>
            From ${new Date(this.startsOn).toLocaleDateString()}
            to ${new Date(this.endsOn).toLocaleDateString()}
            </p>
            <input type="radio" id="apple" name="treasure_hunt" value="${this.uuid}">
        `;
        
        parent.appendChild(container);
    }

}

class Message {
    constructor(text) {
        this.text = text;
    }


    Display() {       
        const container = document.getElementById("message-container");
        const message = document.createElement("div");
        message.className = "message";
        message.innerText = this.text;
        container.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);

      

    }
}


// the state of the app
class AppState {
    constructor() {
        this.currentStage = Stages.List;
    }

	nextStage() {
        if (this.currentStage < Stages.LeaderBoard) {
            this.currentStage++;
        }
        console.log("Current Stage:", this.currentStage);
    }
	getCurentStage() {
		return this.currentStage;
	}

}

class User {
	constructor(session) {
		this.session = session;
	}
}


class Stage {
	
	OnStart() {
        throw new Error("Abstract method 'OnStart' must be implemented by subclass");
    }
	OnEnd() {
		throw new Error("Abstract method 'OnEnd' must be implemented by subclass");
	}

}


//Request data from api
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// convert data into array then display it
async function ListTruasureHunts() {
    const data = await fetchData(API_URL_LIST);
    const treasureHunts = data.treasureHunts.map(h => new TreasureHunt(h));

    const container = document.getElementById("rendered-area");
	
	//crate form
	const form = document.createElement("form");
	form.id = "stageForm";
	container.appendChild(form);

    container.className = "container-treasure-hunts";
    for(let i = 0; i < treasureHunts.length; i++) {
        treasureHunts[i].Display(form);
    }
	
	
	// Add submit button
    const submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Submit";
    form.appendChild(submitBtn);

	//Handle event for submitting
	document.getElementById("stageForm").addEventListener("submit", function(event) {
        event.preventDefault();

		const selected = document.querySelector('input[name="treasure_hunt"]:checked');
        if (selected) {
            const value = selected.value;
            
			app.SetTreasureHuntID(value);
            
        } else {
			// TODO: add some event when nothing is selected
            tmpMSG = new Message("Please select a treasure hunt");
            tmpMSG.Display();
        }

	});

}
//Cleans the renderer before adding 
function ClearRenderer() {
    const container = document.getElementById(RENDERED_AREA_ID);
	container.innerHTML = '';
}


/*  Stages */ 
// TODO: Complete Stages
class ListStage extends Stage {
	OnStart() {
		ListTruasureHunts();
	}

	OnEnd() {
		ClearRenderer();
	}
}



class StartStage extends Stage {
	OnStart() {
		
		const container = document.getElementById(RENDERED_AREA_ID);

		container.innerHTML = `
		<form id="startForm">
            <input type="text" name="nickname" id="nickname-field" />
            <input type="submit" value="Submit" />
        </form>
		
		`
        document.getElementById("startForm").addEventListener("submit", function(event) {
            event.preventDefault();

            const nickname = document.getElementById("nickname-field").value;

            const API_URL_START = `https://codecyprus.org/th/api/start?player=${nickname}&app=TreasureHuntApp&treasure-hunt-id=${app.treasureHuntID}`;
            const data = fetchData(API_URL_START).then(data => {
                if(data.status === "OK") {
                    app.session = data.session;
                    app.numOfQuestions = data.numOfQuestions;
                    app.name = nickname;

                    app.ChangeStage();
                }
                else {
                    console.log(data.errorMessages[0]);
                    const tmpMSG = new Message(data.errorMessages[0]);
                    tmpMSG.Display();
                }

            });
            
	});


	}

	OnEnd() {

        
	    ClearRenderer();
	}
}

/*  Questions */

class Question {
    constructor({
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
        skipScore
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
    }



    Display(parentId) {
        throw new Error("Abstract method 'Display' must be implemented by subclass");
    }

    Answear() {
        throw new Error("Abstract method 'Answear' must be implemented by subclass");
    }
}




class BOOLEANQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const container = document.getElementById(parentId);

        // Render the form with radio buttons
        container.innerHTML = `
            <form id="booleanForm">
                <p>${this.questionText}</p>
                <input type="radio" id="true" name="boolean_question" value="true">
                <label for="true">True</label><br>
                <input type="radio" id="false" name="boolean_question" value="false">
                <label for="false">False</label><br>
                <button type="button" id="submitAnswer">Submit</button>
            </form>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            const selected = document.querySelector('input[name="boolean_question"]:checked');
            this.Answear(selected.value === "true");
        });
    }   
    

    Answear(isCorrect) {
        const API_URL_ANSWER = `https://codecyprus.org/th/api/answer?session=${app.session}&answer=${isCorrect}`;
        const data = fetchData(API_URL_ANSWER).then(data => {
            console.log(data.correct);
            
        });

    }
}




class QuestionStage extends Stage {
    OnStart() {
            const container = document.getElementById(RENDERED_AREA_ID);

            
            this.AskQuestion();
        }
    AskQuestion() {
        const API_URL_QUESTION = `https://codecyprus.org/th/api/question?session=${app.session}`;
        const data = fetchData(API_URL_QUESTION).then(data => {
            if(data.status === "OK") {
                const question = new BOOLEANQuestion(data);
                question.Display(RENDERED_AREA_ID);
            }
            else {
                console.log(data.errorMessages[0]);
                const tmpMSG = new Message(data.errorMessages[0]);
                tmpMSG.Display();
            }
    });
    }   
    OnEnd() {
	    ClearRenderer();
	}
}






/*--------------*/




class App {
	constructor() {
		this.session = null;
		this.name = null;
        this.numOfQuestions = null;
		this.treasureHuntID = null;
        this.score = 0;

		this.appState = new AppState();
		this.StageList = [
			new ListStage(),
			new StartStage(),
            new QuestionStage(),
			// TODO: Add the created stages
		];
		this.StageList[this.appState.getCurentStage()].OnStart();
	}

	ChangeStage() {
		this.StageList[this.appState.getCurentStage()].OnEnd();
		this.StageList[this.appState.getCurentStage()] = null;
		this.appState.nextStage();
		this.StageList[this.appState.getCurentStage()].OnStart();
	}
	Reset() {
		this.session = null;
		this.name = null;
		this.treasureHuntID = null;
	}

	SetTreasureHuntID(id) {
		this.treasureHuntID = id;
		console.log(this.treasureHuntID);
		this.ChangeStage();
	}
}


app = new App();

