import { useState, useEffect, useCallback } from 'react'

/**
 * useCommandPalette - Manage command palette state and keyboard shortcuts
 */
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      // ⌘K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      // ESC to close
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
      // Alt+1..5 quick navigation (dispatches a global event)
      if (e.altKey) {
        const mapping = { '1': 'home', '2': 'work', '3': 'about', '4': 'blog', '5': 'contact' }
        const dest = mapping[e.key]
        if (dest) {
          try {
            window.dispatchEvent(new CustomEvent('quick:navigate', { detail: dest }))
            e.preventDefault()
          } catch (err) {
            // ignore in non-browser environments
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setSearchQuery('')
  }, [])

  const open = useCallback(() => setIsOpen(true), [])

  const search = useCallback((query) => setSearchQuery(query), [])

  return {
    isOpen,
    open,
    close,
    setIsOpen,
    searchQuery,
    search,
    setSearchQuery,
  }
}
