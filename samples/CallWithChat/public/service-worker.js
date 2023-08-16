self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  // You can intercept and modify network requests here
  console.log('Service Worker intercepted a fetch:', event.request.url);
});

self.addEventListener('message', (event) => {
  const message = event.data;
  console.log('Service Worker received a message:', message);

  // Send a message back to the main page
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(`Service Worker says: ${message}`);
    });
  });
});
