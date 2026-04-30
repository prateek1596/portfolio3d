import { useState } from 'react'
import './styles/globals.css'
import Cursor from './components/Cursor'
import Scene from './components/Scene'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'

export default function App() {
  const [active, setActive] = useState('home')

  return (
    <>
      <Cursor />
      <Scene />
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%',
        height: 'calc(100vh - var(--nav-h))',
      }}>
        <Home    visible={active === 'home'} />
        <Work    visible={active === 'work'} />
        <About   visible={active === 'about'} />
        <Contact visible={active === 'contact'} />
      </div>
      <BottomNav active={active} setActive={setActive} />
    </>
  )
}
