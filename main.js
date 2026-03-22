window.onload=()=>{
    "use strict";

    if("serviceWorker" in navigator){
        navigator.serviceWorker.register("/progressiveApp.js");
    }
}