import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)
const THEME_STORAGE_KEY = 'portfolio3d:isDark'
const ACCENT_STORAGE_KEY = 'portfolio3d:accent'

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
    bg: '#ece6da',
    text: '#13141b',
    textSoft: 'rgba(19,20,27,0.8)',
    textMuted: 'rgba(19,20,27,0.66)',
    textFaint: 'rgba(19,20,27,0.48)',
    textGhost: 'rgba(19,20,27,0.24)',
    panel: 'rgba(255,254,250,0.88)',
    panelElevated: 'rgba(255,255,255,0.97)',
    panelBorder: 'rgba(55,62,86,0.2)',
    panelBorderStrong: 'rgba(55,62,86,0.34)',
    panelShadow: '0 18px 55px rgba(35,31,24,0.1)',
    grid: 'rgba(55,62,86,0.85)',
    gridSoft: 'rgba(55,62,86,0.04)',
    line: 'rgba(55,62,86,0.2)',
    lineSoft: 'rgba(55,62,86,0.1)',
    glass: 'rgba(255,254,250,0.84)',
    glassStrong: 'rgba(255,255,255,0.95)',
    orb: 'rgba(58,84,121,0.2)',
    orbSoft: 'rgba(0,140,180,0.18)',
    cursorMix: 'multiply',
  },
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === null ? true : stored === 'true'
  })
  const [accent, setAccent] = useState(() => {
    if (typeof window === 'undefined') return 'gold'
    return window.localStorage.getItem(ACCENT_STORAGE_KEY) || 'gold'
  })

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
    root.style.setProperty('--page-gradient', isDark
      ? 'radial-gradient(circle at top left, rgba(200,169,110,0.08), transparent 34%), radial-gradient(circle at 78% 18%, rgba(0,232,255,0.06), transparent 22%), linear-gradient(180deg, #04040a 0%, #070711 100%)'
      : 'radial-gradient(circle at top left, rgba(55,62,86,0.18), transparent 30%), radial-gradient(circle at 78% 18%, rgba(0,140,180,0.09), transparent 20%), linear-gradient(180deg, #f3ecdf 0%, #e9e1d4 100%)')
    root.style.setProperty('--grain-opacity', isDark ? '0.035' : '0.02')
    root.style.setProperty('--black', theme.bg)
    root.style.setProperty('--white', theme.text)
    root.dataset.theme = isDark ? 'dark' : 'light'
    window.localStorage.setItem(THEME_STORAGE_KEY, String(isDark))
    window.localStorage.setItem(ACCENT_STORAGE_KEY, accent)
  }, [isDark, accent])

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, accent, setAccent, ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
