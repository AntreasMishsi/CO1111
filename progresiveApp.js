const cacheName="Treasure-Hunt";

const fileToCache=["/",
    "/index.html",
    "/app.html",
    "/Quiz.css",
    "/Scripts/Animations/AfterQuestionAnims.js",
    "/Scripts/App/App.js",
    "/Scripts/App/AppState.js",
    "/Scripts/Question/BooleanQuestion.js",
    "/Scripts/Question/IntegerQuestion.js",
    "/Scripts/Question/MCQQuestion.js",
    "/Scripts/Question/NumericQuestion.js",
    "/Scripts/Question/Question.js",
    "/Scripts/Question/TextQuestion.js",
    "/Scripts/Stages/LeaderBoardStage.js",
    "/Scripts/Stages/ListStage.js",
    "/Scripts/Stages/Stages.js",
    "/Scripts/Stages/StartStage.js",
    "/Scripts/Utils/ClearRenderer.js",
    "/Scripts/Utils/Message.js",
    "/Scripts/Utils/Utils.js","" +
    "/main.js"
];

//Start the service worker and cache all of the app's content.
self.addEventListener("install", function(e){
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            return cache.addAll(fileToCache);
        })
    )
})

//Define which content to retrieve when the app is offline.
self.addEventListener("fetch",function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request);
        })
    )
})