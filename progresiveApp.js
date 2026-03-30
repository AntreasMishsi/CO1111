const cacheName="Treasure-Hunt-v1";

const fileToCache=[
    "/CO1111/",
    "/CO1111/index.html",
    "/CO1111/app.html",
    "/CO1111/Quiz.css",
    "/CO1111/Styles/Animation.css",
    "/CO1111/Styles/main.css",
    "/CO1111/Styles/Message.css",
    "/CO1111/Styles/video.css",
    "/CO1111/Scripts/Animations/AfterQuestionAnims.js",
    "/CO1111/Scripts/App/App.js",
    "/CO1111/Scripts/App/AppState.js",
    "/CO1111/Scripts/Question/BooleanQuestion.js",
    "/CO1111/Scripts/Question/IntegerQuestion.js",
    "/CO1111/Scripts/Question/MCQQuestion.js",
    "/CO1111/Scripts/Question/NumericQuestion.js",
    "/CO1111/Scripts/Question/Question.js",
    "/CO1111/Scripts/Question/TextQuestion.js",
    "/CO1111/Scripts/Stages/LeaderBoardStage.js",
    "/CO1111/Scripts/Stages/ListStage.js",
    "/CO1111/Scripts/Stages/Stages.js",
    "/CO1111/Scripts/Stages/StartStage.js",
    "/CO1111/Scripts/Utils/ClearRenderer.js",
    "/CO1111/Scripts/Utils/Message.js",
    "/CO1111/Scripts/Utils/Utils.js",
    "/CO1111/main.js",
    "/CO1111/Resources/icons/check.png",
    "/CO1111/Resources/icons/check.svg",
    "/CO1111/Resources/icons/x.png",
    "/CO1111/Resources/icons/x.svg",
    "/CO1111/Resources/pictures/x.png",
    "/CO1111/Resources/pictures/facebook.png",
    "/CO1111/Resources/pictures/instagram.png",
    "/CO1111/Resources/pictures/logo.png",
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
