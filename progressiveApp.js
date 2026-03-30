const cacheName="Treasure-Hunt-v1";

const fileToCache=[
    "/CO1111/",
    "index.html",
    "app.html",
    "Quiz.css",
    "Animation.css",
    "main.css",
    "Message.css",
    "video.css",
    "AfterQuestionAnims.js",
    "App.js",
    "AppState.js",
    "BooleanQuestion.js",
    "IntegerQuestion.js",
    "MCQQuestion.js",
    "NumericQuestion.js",
    "Question.js",
    "TextQuestion.js",
    "LeaderBoardStage.js",
    "ListStage.js",
    "Stages.js",
    "StartStage.js",
    "ClearRenderer.js",
    "Message.js",
    "Utils.js",
    "main.js",
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
