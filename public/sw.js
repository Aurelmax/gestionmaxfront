// Service Worker basique pour éviter les erreurs
const CACHE_NAME = 'gestionmax-v1'

// Installation du service worker
self.addEventListener('install', event => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interception des requêtes
self.addEventListener('fetch', event => {
  // Ignorer les requêtes des extensions de navigateur
  if (
    event.request.url.startsWith('chrome-extension://') ||
    event.request.url.startsWith('moz-extension://') ||
    event.request.url.startsWith('safari-extension://')
  ) {
    return
  }

  // Ignorer les requêtes non-HTTP
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback en cas d'erreur réseau
      return new Response('Offline', { status: 503 })
    })
  )
})
