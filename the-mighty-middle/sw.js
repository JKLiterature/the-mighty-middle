/**
 * Literature Review Tracker - Service Worker
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'literature-tracker-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/filters.js',
    '/js/export.js'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('Service Worker: Installed successfully');
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('Service Worker: Activated successfully');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Return cached version if available
                if (response) {
                    console.log('Service Worker: Serving from cache', event.request.url);
                    return response;
                }
                
                // Otherwise fetch from network
                console.log('Service Worker: Fetching from network', event.request.url);
                return fetch(event.request).then(function(response) {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Add to cache for future use
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(function(error) {
                console.error('Service Worker: Fetch failed', error);
                
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                
                // For other requests, you might want to return a default response
                return new Response('Offline - Content not available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
});

// Background sync for saving data when online
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync-data') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(syncData());
    }
});

// Sync data when connection is restored
function syncData() {
    return new Promise((resolve, reject) => {
        // Check if there's pending data to sync
        // This would integrate with your app's data persistence logic
        console.log('Service Worker: Syncing data...');
        
        // For now, just resolve - implement actual sync logic based on your needs
        resolve();
    });
}

// Handle messages from the main thread
self.addEventListener('message', function(event) {
    console.log('Service Worker: Received message', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Notification click handler (if you want to add notifications later)
self.addEventListener('notificationclick', function(event) {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    // Open the app when notification is clicked
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Push event handler (for future push notification support)
self.addEventListener('push', function(event) {
    console.log('Service Worker: Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update available',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Literature Review Tracker', options)
    );
});