

//#region Basic Setup
/* Constants*/ 
const API_URL_LIST = 'https://codecyprus.org/th/api/list';
const RENDERED_AREA_ID = 'rendered-area';


const Stages = {
	List: 0,
	Start: 1,
	Question: 2,
	LeaderBoard: 3
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


//Request data from api
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


function ClearRenderer() {
    const container = document.getElementById(RENDERED_AREA_ID);
	container.innerHTML = '';
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//#endregion



//#region Stages
class Stage {
	
	OnStart() {
        throw new Error("Abstract method 'OnStart' must be implemented by subclass");
    }
	OnEnd() {
		throw new Error("Abstract method 'OnEnd' must be implemented by subclass");
	}

}


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


class QuestionStage extends Stage {
    OnStart() {
            const container = document.getElementById(RENDERED_AREA_ID);
            this.QuestionTypes = {
                "INTEGER": INTEGERQuestion,
                "BOOLEAN": BOOLEANQuestion,
                "NUMERIC": NUMERICQuestion,
                "MCQ": MCQuestion,
                "TEXT": TEXTquestion,
            };
            
            this.AskQuestion();
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
                    const questionClass = this.QuestionTypes[questionData.questionType];
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

    OnEnd() {
	    ClearRenderer();
	}
}


class LeaderBoard extends Stage {

    OnStart() {

        const container = document.getElementById(RENDERED_AREA_ID);

        container.innerHTML = `
        <div style="text-align:center;">
            <h2> Leaderboard</h2>

            <button id="loadLeaderboard" style="
                padding:10px 20px;
                font-size:16px;
                cursor:pointer;
                margin-bottom:20px;
            ">
                Load Leaderboard
            </button>

            <div id="leaderboard"></div>
        </div>
        `;

        document.getElementById("loadLeaderboard").addEventListener("click", () => {
            this.DisplayLeaderBoard();
        });
    }

    DisplayLeaderBoard() {

        const leaderboard_container = document.getElementById("leaderboard");

        const API_URL =
        `https://codecyprus.org/th/api/leaderboard?session=${app.session}&treasure-hunt-id=${app.treasureHuntID}&sorted&limit=10`;

        fetchData(API_URL).then(data => {

            if(data.status !== "OK"){
                const tmpMSG = new Message(data.errorMessages[0]);
                tmpMSG.Display();
                return;
            }

            leaderboard_container.innerHTML = `
            <table style="
                width:100%;
                border-collapse:collapse;
                text-align:center;
                font-size:18px;
            ">
                <thead style="background:#333;color:white;">
                    <tr>
                        <th style="padding:10px;border:1px solid #ccc;">Rank</th>
                        <th style="padding:10px;border:1px solid #ccc;">Player</th>
                        <th style="padding:10px;border:1px solid #ccc;">Score</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body"></tbody>
            </table>
            `;

            const tableBody = document.getElementById("leaderboard-body");

            data.leaderboard.forEach((player, index) => {

                const row = document.createElement("tr");

                row.innerHTML = `
                <td style="padding:10px;border:1px solid #ccc;">
                    ${index + 1}
                </td>
                <td style="padding:10px;border:1px solid #ccc;">
                    ${player.player}
                </td>
                <td style="padding:10px;border:1px solid #ccc;">
                    ${player.score}
                </td>
                `;

                tableBody.appendChild(row);
            });

        });
    }

    OnEnd() {
        ClearRenderer();
    }
}
// #endregion



//#region Animation
const animationDuration = 1000;


function playCorrectAnimation() {
        const container = document.getElementById(RENDERED_AREA_ID);
        ClearRenderer();
        // Create a green checkmark
        const check = document.createElement("div");
        check.innerHTML = "✔";
        check.style.position = "absolute";
        check.style.fontSize = "50px";
        check.style.color = "green";
        check.style.opacity = "0";
        check.style.transition = "all 0.5s ease-out";
        container.appendChild(check);

        // Animate the checkmark
        requestAnimationFrame(() => {
            check.style.opacity = "1";
            check.style.transform = "scale(1.5)";
        });

        // Fade out and remove after 1 second
        setTimeout(() => {
            check.style.opacity = "0";
            check.style.transform = "scale(1)";
            setTimeout(() => container.removeChild(check), 500);
        }, animationDuration);
}


function playWrongAnimation() {
        const container = document.getElementById(RENDERED_AREA_ID);
        ClearRenderer();
        // Create a red x
        const check = document.createElement("div");
        check.innerHTML = "X";
        check.style.position = "absolute";
        check.style.fontSize = "50px";
        check.style.color = "red";
        check.style.opacity = "0";
        check.style.transition = "all 0.5s ease-out";
        container.appendChild(check);

        // Animate the checkmark
        requestAnimationFrame(() => {
            check.style.opacity = "1";
            check.style.transform = "scale(1.5)";
        });

        // Fade out and remove after 1 second
        setTimeout(() => {
            check.style.opacity = "0";
            check.style.transform = "scale(1)";
            setTimeout(() => container.removeChild(check), 500);
        }, animationDuration);
}
//#endregion



//#region Questions
//TODO: fix this - make better design
class Question {
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
    Skip() {
        this.parentStage.SkipQuestion();
    }
}


class BOOLEANQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const API_SCORE = `https://codecyprus.org/th/api/score?session=${app.session}`;
        const container = document.getElementById(parentId);
        // Render the form with radio buttons
        container.innerHTML = `
        <h2>Score: ${app.score}</h2>
            <div id="booleanForm">
                <p>${this.questionText}</p>
                <input type="radio" id="true" name="boolean_question" value="true">
                <label for="true">True</label><br>
                <input type="radio" id="false" name="boolean_question" value="false">
                <label for="false">False</label><br>
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
            </div>
        `;
        
        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            const selected = document.querySelector('input[name="boolean_question"]:checked');
            this.Answear(selected.value === "true");
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
        const data = fetchData(API_URL_ANSWER).then(data => {
            console.log(data.correct);
            if(data.correct == false) {
                playWrongAnimation();
            }
            else {
                playCorrectAnimation();
            }
            
        });
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }
}


class INTEGERQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const API_SCORE = `https://codecyprus.org/th/api/score?session=${app.session}`;
        const container = document.getElementById(parentId);


        
        
        // Render the form with radio buttons
        container.innerHTML = `
            <h2>Score: ${app.score}</h2>
            <div id="integerForm">
                <p>${this.questionText}</p>
                <input type="number" id="integerInput" name="integer_question" placeholder="Enter an integer number" step="1" oninput="this.value = Math.round(this.value);">
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
            </div>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            const input = document.getElementById("integerInput").value;
            const number = parseInt(input, 10); // Convert string to integer
            if (!isNaN(number)) {
                this.Answear(number); // Pass the integer to the Answer method
            } else {
                alert("Please enter a valid integer.");
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
        const data = fetchData(API_URL_ANSWER).then(data => {
            console.log(data.correct);
            if(data.correct == false) {
                playWrongAnimation();
            }
            else {
                playCorrectAnimation();
            }
            
        });
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }
}


class NUMERICQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
        
        const container = document.getElementById(parentId);
        // Render the form with radio buttons
        container.innerHTML = `
        <h2>Score: ${app.score}</h2>
            <div id="integerForm">
                <p>${this.questionText}</p>
                <input type="number" id="numericInput" name="numeric_question" placeholder="Enter a number">
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
            </div>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            const input = document.getElementById("numericInput").value;
            const number = parseFloat(input); // Convert string to float

            if (!isNaN(number)) {
                this.Answear(number); // Pass the float to the Answer method
            } else {
                alert("Please enter a valid number.");
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
        const data = fetchData(API_URL_ANSWER).then(data => {
            console.log(data.correct);
            if(data.correct == false) {
                playWrongAnimation();
            }
            else {
                playCorrectAnimation();
            }
            
        });
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }


    
}


class TEXTquestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
        const API_SCORE = `https://codecyprus.org/th/api/score?session=${app.session}`;
        const container = document.getElementById(parentId);

        // Render the form with radio buttons

        container.innerHTML = `
            <h2>Score: ${app.score}</h2>
            <div id="textForm">
                <p>${this.questionText}</p>
                <input type="text" id="textInput" name="text_question" placeholder="Enter your answer">
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
                alert("Please enter an answer.");
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
        const data = fetchData(API_URL_ANSWER).then(data => {
            console.log(data.correct);
            if(data.correct == false) {
                playWrongAnimation();
            }
            else {
                playCorrectAnimation();
            }
            
        });
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }
}


class MCQuestion extends Question {


    constructor(props) {
        super(props);
    }

    Display(parentId) {
       
        const container = document.getElementById(parentId);
        // Render the form with radio buttons
        container.innerHTML = `
        <h2>Score: ${app.score}</h2>
            <div id="mcqForm">
                <p>${this.questionText}</p>
                <input type="radio" id="A" name="mcq_question" value="A">
                <label for="A">A</label><br>
                <input type="radio" id="B" name="mcq_question" value="B">
                <label for="B">B</label><br>
                <input type="radio" id="C" name="mcq_question" value="C">
                <label for="C">C</label><br>
                <input type="radio" id="D" name="mcq_question" value="D">
                <label for="D">D</label><br>
                <button type="button" id="submitAnswer">Submit</button>
                ${this.canBeSkipped ? `<button type="button" id="skipButton">Skip</button>` : ''}
            </div>
        `;

        // Add click listener for the button to get the answer
        const submitButton = document.getElementById("submitAnswer");
        submitButton.addEventListener("click", () => {
            
            const selected = document.querySelector('input[name="mcq_question"]:checked');
            this.Answear(selected.value);
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
        const data = fetchData(API_URL_ANSWER).then(data => {

            console.log(data.correct);
            if(data.correct == false) {
                playWrongAnimation();
            }
            else {
                playCorrectAnimation();
            }
           
        });
        await sleep(animationDuration);
        this.parentStage.AskQuestion();
    }

    
}
//#endregion



//#region App
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
             new LeaderBoard(),
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
//#endregion
