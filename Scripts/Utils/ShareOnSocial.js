import { app } from "../App/App.js";

export function ShareToTwitter() {
    const text = `I just completed the ${app.treasureHuntName}, and got ${app.score}!!!`;

    const url = window.location.href; 
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

    window.open(twitterUrl, '_blank', 'width=600,height=400');
}