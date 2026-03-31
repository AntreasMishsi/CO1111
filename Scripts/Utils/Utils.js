

// get the data from api and turn it into json
export async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


// sleep for the duration
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}