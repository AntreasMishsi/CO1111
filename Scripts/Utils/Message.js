

const animationDuration = 3000;

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
        
        requestAnimationFrame(() => {
            message.classList.add("received");
        });


        setTimeout(() => {
            message.classList.remove("received");
            message.addEventListener("transitionend", () => {
                message.remove();
            });
            
        }, animationDuration);

    }
}