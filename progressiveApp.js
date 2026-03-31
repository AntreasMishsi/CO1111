const cacheName="Treasure-Hunt-v1";

const fileToCache=[
    "/",
    "index.html",
    "app.html",
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
