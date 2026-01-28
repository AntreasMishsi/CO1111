

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
async function fetchTreasureHunt(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
// convert data into array then display it
async function ListTruasureHunts() {
    const data = await fetchTreasureHunt(API_URL);
    const treasureHunts = data.treasureHunts.map(h => new TreasureHunt(h));

    const container = document.createElement("div");
    container.className = "container-treasure-hunts";
    console.log(data);
    for(let i = 0; i < treasureHunts.length; i++) {
        treasureHunts[i].Display(container);
    }
    
    document.body.appendChild(container);

}


ListTruasureHunts();


