import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const ACCENTS = {
  gold:  { primary: '#c8a96e', label: 'Gold'  },
  cyan:  { primary: '#00e8ff', label: 'Cyan'  },
  red:   { primary: '#ff2d55', label: 'Red'   },
  green: { primary: '#39ff14', label: 'Neon'  },
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const [accent, setAccent] = useState('gold')

  useEffect(() => {
    const root = document.documentElement
    const a = ACCENTS[accent].primary
    root.style.setProperty('--gold', a)
    root.style.setProperty('--accent', a)
    if (!isDark) {
      root.style.setProperty('--black', '#f0ebe0')
      root.style.setProperty('--white', '#0a0a12')
    } else {
      root.style.setProperty('--black', '#04040a')
      root.style.setProperty('--white', '#f2ece0')
    }
  }, [isDark, accent])

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, accent, setAccent, ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
