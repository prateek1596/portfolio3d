/* eslint-env serviceworker */
// Enhanced Service Worker: cache-first for assets, stale-while-revalidate for API/images,
// and a navigation fallback to an offline page.
const CACHE_VERSION = 2
const PRECACHE = `prateek-precache-v${CACHE_VERSION}`
const RUNTIME = `prateek-runtime-v${CACHE_VERSION}`

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/offline.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (![PRECACHE, RUNTIME].includes(key)) return caches.delete(key)
      })
    ))
  )
  self.clients.claim()
})

// Helper: network-first for navigation, cache-first for precached assets,
// stale-while-revalidate for runtime resources (images/api/js/css)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)

  // Always serve navigation requests from network first, fallback to cache/offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        // Put a copy in the runtime cache for future offline access
        const copy = response.clone()
        caches.open(RUNTIME).then((cache) => cache.put(event.request, copy))
        return response
      }).catch(() => caches.match('/offline.html'))
    )
    return
  }

  // For same-origin assets (images, CSS, JS), use cache-first then stale revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const respClone = response.clone()
            caches.open(RUNTIME).then((cache) => cache.put(event.request, respClone))
          }
          return response
        }).catch(() => {})

        // Return cached if available otherwise network, but keep network fetch updating cache
        return cached || networkFetch
      })
    )
    return
  }

  // Default: try network, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})

// Background sync stub for contact forms
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-contact-form') {
    event.waitUntil(syncContactForm())
  }
})

async function syncContactForm() {
  try {
    // Placeholder for background sync logic
    console.log('Syncing contact form...')
  } catch (error) {
    console.error('Sync failed:', error)
    throw error
  }
}

// Push notifications handlers
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const options = {
    body: data.message || 'New message from Prateek',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: 'notification',
  }

  event.waitUntil(self.registration.showNotification(data.title || 'Prateek Portfolio', options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus()
      return clients.openWindow('/')
    })
  )
})
