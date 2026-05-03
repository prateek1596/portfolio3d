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
