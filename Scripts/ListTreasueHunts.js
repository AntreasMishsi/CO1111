

const API_URL = 'https://codecyprus.org/th/api/list';

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
        `;

        parent.appendChild(container);
    }

}

//Request data from api
function fetchTreasureHunt(url) {
    const response = fetch(url);
    const data = response.json();
    return data;
}
// convert data into array then display it
function ListTruasureHunts() {
    const data = fetchTreasureHunt(API_URL);
    const treasureHunts = data.treasureHunts.map(h => new TreasureHunt(h));

    const container = document.createElement("div");
    container.className = "container-treasure-hunts";

    for(let i = 0; i < treasureHunts.length; i++) {
        treasureHunts.Display(container);
    }
    

}


ListTruasureHunts();


