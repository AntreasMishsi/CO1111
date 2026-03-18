export class Message {
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