


export async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}



export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}