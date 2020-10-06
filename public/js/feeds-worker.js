self.onmessage = (event)=>{
    console.log(event.data);
};

// self.addEventListener('install', (event)=>{
//     event.waitUntil(
//         caches.open("v1").then((cache)=>{
//             console.log("Cache opened");
//             return cache.addAll(["/css/style.css"])
//         }).catch(err=>{
//             console.log("failed to open caches");
//         })
//     );
//     console.log("Service worker installed.");
// });
// self.addEventListener('activate', (ev)=>{
//     console.log("Service worker activated.");
// });
// self.addEventListener('fetch', function(event) {
//     console.log(event.request);
//     event.respondWith(
//       caches.match(event.request)
//         .then(function(response) {
//           // Cache hit - return response
//           if (response) {
//             return response;
//           }
//           return fetch(event.request);
//         }
//       )
//     );
//   });