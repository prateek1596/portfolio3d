import { useState, useCallback } from 'react'
import './styles/globals.css'
import { ThemeProvider } from './hooks/useTheme'
import { useSounds } from './hooks/useSounds'
import Cursor from './components/Cursor'
import Scene from './components/Scene'
import BottomNav from './components/BottomNav'
import Loader from './components/Loader'
import PageTransition from './components/PageTransition'
import ThemeControls from './components/ThemeControls'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'

function Inner() {
  const [active, setActive] = useState('home')
  const [loaded, setLoaded] = useState(false)
  const [transKey, setTransKey] = useState(0)
  const sounds = useSounds()

  const navigate = useCallback((page) => {
    if (page === active) return
    setTransKey(k => k + 1)
    setActive(page)
  }, [active])

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <Scene />
      <PageTransition pageKey={transKey} />

      {/* Top-right settings panel */}
      <ThemeControls sounds={sounds} />

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
  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  )
}
