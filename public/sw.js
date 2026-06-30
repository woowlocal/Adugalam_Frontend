self.addEventListener('fetch', function(event) {
  // Pass through fetch to satisfy PWA requirements
  event.respondWith(fetch(event.request).catch(() => new Response("Offline")));
});
