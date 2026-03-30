import { Message } from "../Utils/Message.js";



function DisplayMessage(text) {
    new Message(text).Display();
}


document.getElementById("display-message")
    .addEventListener("click", function () {
        let value = document.getElementById("x").value;
        DisplayMessage(value);
});