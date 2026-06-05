import { useEffect, useState } from 'react'

export default function AnalyticsConsent() {
  const STORAGE_KEY = 'analytics:consent'
  const UMAMI_SRC = import.meta.env.VITE_UMAMI_SRC
  const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID

  const [granted, setGranted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    if (granted) {
      // load Umami script dynamically
      if (UMAMI_SRC && UMAMI_WEBSITE_ID && !document.querySelector(`script[data-website-id="${UMAMI_WEBSITE_ID}"]`)) {
        const s = document.createElement('script')
        s.src = `${UMAMI_SRC.replace(/\/$/, '')}/umami.js`
        s.async = true
        s.defer = true
        s.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
        document.head.appendChild(s)
      }
    }
  }, [granted])

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'true') } catch (e) {}
    setGranted(true)
  }

  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, 'false') } catch (e) {}
    setGranted(false)
  }

  if (granted) return null

  return (
    <div style={{ position: 'fixed', bottom: 18, left: 18, right: 18, zIndex: 1000, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '12px 16px', borderRadius: 10, maxWidth: 900, width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <strong>Analytics</strong>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Help improve this site with anonymous analytics. We respect Do Not Track and never collect personal data.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={decline} style={{ background: 'transparent', color: '#ccc', border: '1px solid #333', padding: '8px 12px', borderRadius: 6 }}>Decline</button>
          <button onClick={accept} style={{ background: '#9fd3c7', color: '#022', border: 'none', padding: '8px 12px', borderRadius: 6 }}>Accept</button>
        </div>
      </div>
    </div>
  )
}
