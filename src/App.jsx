import { useState, useCallback, useEffect } from 'react'
import './styles/globals.css'
import { ThemeProvider } from './hooks/useTheme'
import { useSounds } from './hooks/useSounds'
import { useCommandPalette } from './hooks/useCommandPalette'
import { useEasterEggs } from './hooks/useEasterEggs'
import Cursor from './components/Cursor'
import Scene from './components/Scene'
import BottomNav from './components/BottomNav'
import Loader from './components/Loader'
import PageTransition from './components/PageTransition'
import ThemeControls from './components/ThemeControls'
import CommandPalette from './components/CommandPalette'
import EasterEggs from './components/EasterEggs'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import { injectStructuredData, updateMetaTags, getPageMetaTags } from './utils/seo'

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

      <Scene />
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
        <Home    visible={active === 'home'}    sounds={sounds} />
        <Work    visible={active === 'work'}    sounds={sounds} />
        <About   visible={active === 'about'}   sounds={sounds} />
        <Blog    visible={active === 'blog'}    sounds={sounds} />
        <Contact visible={active === 'contact'} sounds={sounds} />
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
