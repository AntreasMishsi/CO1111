window.onload = () => {
    "use strict";

    if ("progressiveApp" in navigator) {
        navigator.progressiveApp.register("./progressiveApp.js")
            .then(reg => console.log("Service Worker registered:", reg))
            .catch(err => console.error("Service Worker registration failed:", err));
    }
}
