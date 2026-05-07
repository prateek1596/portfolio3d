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

const Scene = lazy(() => import('./components/Scene'))
const Work = lazy(() => import('./pages/Work'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const Contact = lazy(() => import('./pages/Contact'))

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
  const [active, setActive] = useState('home')
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
  }, [active])

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
        <Scene />
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

      <BottomNav active={active} setActive={navigate} sounds={sounds} />
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
