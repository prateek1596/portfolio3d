import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import './styles/globals.css'
import { ThemeProvider } from './hooks/useTheme'
import { useSounds } from './hooks/useSounds'
import { useCommandPalette } from './hooks/useCommandPalette'
import { useEasterEggs } from './hooks/useEasterEggs'
import Cursor from './components/Cursor'
import BottomNav from './components/BottomNav'
import Loader from './components/Loader'
import PageTransition from './components/PageTransition'
import ThemeControls from './components/ThemeControls'
import CommandPalette from './components/CommandPalette'
import EasterEggs from './components/EasterEggs'
import Home from './pages/Home'
import { injectStructuredData, updateMetaTags, getPageMetaTags } from './utils/seo'

const loadScene = () => import('./components/Scene')
const loadWork = () => import('./pages/Work')
const loadAbout = () => import('./pages/About')
const loadBlog = () => import('./pages/Blog')
const loadContact = () => import('./pages/Contact')

const Scene = lazy(loadScene)
const Work = lazy(loadWork)
const About = lazy(loadAbout)
const Blog = lazy(loadBlog)
const Contact = lazy(loadContact)

function SectionFallback() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-faint)',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
    }}>
      Loading section...
    </div>
  )
}

  function Inner() {
  // Read initial page from URL (?page=work) so PWA/shortcuts open correct section
  const getInitialPage = () => {
    try {
      const params = new URLSearchParams(window.location.search)
      const p = params.get('page')
      if (p && ['home', 'work', 'about', 'blog', 'contact'].includes(p)) return p
    } catch (err) {
      // ignore
    }
    return 'home'
  }

  const [active, setActive] = useState(getInitialPage)
  const [loaded, setLoaded] = useState(false)
  const [transKey, setTransKey] = useState(0)
  const sounds = useSounds()
  const cmdPalette = useCommandPalette()

  // Initialize Easter Eggs system
  useEasterEggs()

  // Initialize SEO on mount
  useEffect(() => {
    injectStructuredData()
    updateMetaTags(getPageMetaTags('home'))
  }, [])

  useEffect(() => {
    const idle = window.requestIdleCallback?.(() => {
      loadScene()
      loadWork()
      loadAbout()
      loadBlog()
      loadContact()
    })

    if (!idle) {
      const timeout = window.setTimeout(() => {
        loadScene()
        loadWork()
        loadAbout()
        loadBlog()
        loadContact()
      }, 1200)

      return () => window.clearTimeout(timeout)
    }

    return () => window.cancelIdleCallback?.(idle)
  }, [])

  // Update SEO when page changes
  useEffect(() => {
    const pageMeta = getPageMetaTags(active)
    updateMetaTags({
      ...pageMeta,
      url: `https://prateek.dev/?page=${active}`,
    })
  }, [active])

  const navigate = useCallback((page) => {
    if (page === active) return
    setTransKey(k => k + 1)
    setActive(page)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('page', page)
      window.history.replaceState({}, '', url.toString())
    } catch (err) {
      // ignore in non-browser environments
    }
  }, [active])

  // Listen for quick navigation events (Alt+1..5)
  useEffect(() => {
    const handler = (e) => {
      const dest = e.detail
      if (dest) navigate(dest)
    }
    window.addEventListener('quick:navigate', handler)
    return () => window.removeEventListener('quick:navigate', handler)
  }, [navigate])

  const handleCommand = useCallback((cmdId) => {
    switch (cmdId) {
      case 'home':
      case 'work':
      case 'about':
      case 'blog':
      case 'contact':
        navigate(cmdId)
        break
      case 'github':
        window.open('https://github.com/prateek', '_blank')
        break
      case 'twitter':
        window.open('https://twitter.com/prateek', '_blank')
        break
      case 'linkedin':
        window.open('https://linkedin.com/in/prateek', '_blank')
        break
      case 'theme':
        // This will be handled by ThemeControls
        break
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'Prateek - Full Stack Developer & ML Engineer',
            text: 'Check out my portfolio!',
            url: window.location.href,
          })
        } else {
          navigator.clipboard.writeText(window.location.href)
          alert('Portfolio link copied!')
        }
        break
      default:
        break
    }
  }, [navigate])

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <Suspense fallback={null}>
        <Scene active={active} />
      </Suspense>
      <PageTransition pageKey={transKey} />

      {/* Top-right settings panel */}
      <ThemeControls sounds={sounds} />

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdPalette.isOpen}
        onClose={cmdPalette.close}
        onNavigate={navigate}
        onAction={handleCommand}
      />

      {/* Easter Eggs */}
      <EasterEggs />

      {/* Pages */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%',
        height: 'calc(100vh - var(--nav-h))',
      }}>
        <Suspense fallback={<SectionFallback />}>
          {active === 'home' && <Home visible sounds={sounds} navigate={navigate} />}
          {active === 'work' && <Work visible sounds={sounds} />}
          {active === 'about' && <About visible sounds={sounds} />}
          {active === 'blog' && <Blog visible sounds={sounds} />}
          {active === 'contact' && <Contact visible sounds={sounds} />}
        </Suspense>
      </div>

      <BottomNav active={active} setActive={navigate} sounds={sounds} onPrefetch={(page) => {
        switch (page) {
          case 'work':
            loadWork()
            break
          case 'about':
            loadAbout()
            break
          case 'blog':
            loadBlog()
            break
          case 'contact':
            loadContact()
            break
          default:
            break
        }
      }} />
      <Cursor />
    </>
  )
}

export default function App() {
  // PWA Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('Service Worker registered:', registration)
        },
        (error) => {
          console.log('Service Worker registration failed:', error)
        }
      )
    }
  }, [])

  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  )
}
