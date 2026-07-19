// Basic Service Worker for PWA installation requirement
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Let the browser do its default thing
  // For offline support, you would cache responses here
});
