
const API_URL = 'https://codecyprus.org/th/api/list';

class Player {
    constructor(name, session) {
        this.name = name;
        this.session = session;
    }
}



async function fetchStart(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}