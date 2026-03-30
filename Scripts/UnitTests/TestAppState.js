import { AppState } from "../App/AppState.js";


let appStateTest = new AppState();

let appStateLiveTest = new AppState();


let testPairs = [
    { action: "next", expected: 1 },
    { action: "next", expected: 2 },
    { action: "set", value: 0, expected: 0 },
    { action: "set", value: 999, expected: 0 },
    { action: "set", value: -5, expected: 0 } 
];



function runTests() {
    let html = "";
    console.log( testPairs.length);
    for(let i = 0; i < testPairs.length; i++) {
        let pair = testPairs[i];

        if(pair.action === "next") {
            appStateTest.nextStage();
        }
        else if(pair.action === "set") {
            appStateTest.setStage(pair.value);
        }
        
        let success = appStateTest.getCurentStage() === pair.expected;
        html += `
            <tr>
                <td>${i}</td>
                <td>${"value" in pair ? pair.value : "________"}</td>
                <td>  ${pair.expected} </td>
                <td>${appStateTest.getCurentStage()}</td>
                <td>
                    ${success ? 'PASS' : 'FAIL'}
                </td>
            </tr>
        `;
    }
    document.getElementById("test-results-table").innerHTML += html;
}

function compute(action) {
    SendCurrentStage();
}

function SendCurrentStage(x) {
    document.getElementById("answear").innerHTML = `Current stage: ${appStateLiveTest.getCurentStage()}. Current X is ${x}`
}
document.getElementById("next-stage-button")
    .addEventListener("click", function () {
        
        appStateLiveTest.nextStage();
        SendCurrentStage("nextStage()");
});

document.getElementById("set-stage-button")
    .addEventListener("click", function () {
        let value = document.getElementById("x").value;
        if(value) {
            appStateLiveTest.setStage(value);
            SendCurrentStage(value);
        }
        
});

runTests()