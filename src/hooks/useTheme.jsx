import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const ACCENTS = {
  gold:  { primary: '#c8a96e', label: 'Gold'  },
  cyan:  { primary: '#00e8ff', label: 'Cyan'  },
  red:   { primary: '#ff2d55', label: 'Red'   },
  green: { primary: '#39ff14', label: 'Neon'  },
}

const THEMES = {
  dark: {
    bg: '#04040a',
    text: '#f2ece0',
    textSoft: 'rgba(242,236,224,0.72)',
    textMuted: 'rgba(242,236,224,0.56)',
    textFaint: 'rgba(242,236,224,0.36)',
    textGhost: 'rgba(242,236,224,0.18)',
    panel: 'rgba(8,8,16,0.92)',
    panelElevated: 'rgba(4,4,10,0.94)',
    panelBorder: 'rgba(200,169,110,0.18)',
    panelBorderStrong: 'rgba(200,169,110,0.3)',
    panelShadow: '0 20px 60px rgba(0,0,0,0.35)',
    grid: 'rgba(200,169,110,0.08)',
    gridSoft: 'rgba(200,169,110,0.04)',
    line: 'rgba(200,169,110,0.12)',
    lineSoft: 'rgba(200,169,110,0.06)',
    glass: 'rgba(4,4,10,0.78)',
    glassStrong: 'rgba(4,4,10,0.88)',
    orb: 'rgba(200,169,110,0.15)',
    orbSoft: 'rgba(0,232,255,0.1)',
    cursorMix: 'difference',
  },
  light: {
    bg: '#f4efe6',
    text: '#17161f',
    textSoft: 'rgba(23,22,31,0.75)',
    textMuted: 'rgba(23,22,31,0.6)',
    textFaint: 'rgba(23,22,31,0.42)',
    textGhost: 'rgba(23,22,31,0.2)',
    panel: 'rgba(255,252,245,0.9)',
    panelElevated: 'rgba(255,255,255,0.96)',
    panelBorder: 'rgba(60,67,96,0.16)',
    panelBorderStrong: 'rgba(60,67,96,0.28)',
    panelShadow: '0 18px 55px rgba(35,31,24,0.12)',
    grid: 'rgba(60,67,96,0.1)',
    gridSoft: 'rgba(60,67,96,0.05)',
    line: 'rgba(60,67,96,0.16)',
    lineSoft: 'rgba(60,67,96,0.08)',
    glass: 'rgba(255,252,245,0.78)',
    glassStrong: 'rgba(255,255,255,0.9)',
    orb: 'rgba(58,84,121,0.16)',
    orbSoft: 'rgba(0,140,180,0.12)',
    cursorMix: 'multiply',
  },
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const [accent, setAccent] = useState('gold')

  useEffect(() => {
    const root = document.documentElement
    const a = ACCENTS[accent].primary
    const theme = isDark ? THEMES.dark : THEMES.light

    root.style.setProperty('--gold', a)
    root.style.setProperty('--accent', a)
    root.style.setProperty('--bg', theme.bg)
    root.style.setProperty('--text', theme.text)
    root.style.setProperty('--text-soft', theme.textSoft)
    root.style.setProperty('--text-muted', theme.textMuted)
    root.style.setProperty('--text-faint', theme.textFaint)
    root.style.setProperty('--text-ghost', theme.textGhost)
    root.style.setProperty('--panel-bg', theme.panel)
    root.style.setProperty('--panel-bg-elevated', theme.panelElevated)
    root.style.setProperty('--panel-border', theme.panelBorder)
    root.style.setProperty('--panel-border-strong', theme.panelBorderStrong)
    root.style.setProperty('--panel-shadow', theme.panelShadow)
    root.style.setProperty('--grid-line', theme.grid)
    root.style.setProperty('--grid-line-soft', theme.gridSoft)
    root.style.setProperty('--rule', theme.line)
    root.style.setProperty('--rule-soft', theme.lineSoft)
    root.style.setProperty('--glass-bg', theme.glass)
    root.style.setProperty('--glass-bg-strong', theme.glassStrong)
    root.style.setProperty('--orb-color', theme.orb)
    root.style.setProperty('--orb-color-soft', theme.orbSoft)
    root.style.setProperty('--cursor-mix', theme.cursorMix)
    root.style.setProperty('--black', theme.bg)
    root.style.setProperty('--white', theme.text)
    root.dataset.theme = isDark ? 'dark' : 'light'
  }, [isDark, accent])

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, accent, setAccent, ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
