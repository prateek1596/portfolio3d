import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './CommandPalette.css'

const COMMANDS = [
  { id: 'home', label: 'Home', description: 'Go to home', category: 'Navigation' },
  { id: 'work', label: 'Work', description: 'View projects', category: 'Navigation' },
  { id: 'about', label: 'About', description: 'Learn about me', category: 'Navigation' },
  { id: 'blog', label: 'Blog', description: 'Read articles', category: 'Navigation' },
  { id: 'contact', label: 'Contact', description: 'Get in touch', category: 'Navigation' },
  { id: 'github', label: 'GitHub', description: 'Open GitHub profile', category: 'Links', icon: '🔗' },
  { id: 'twitter', label: 'Twitter', description: 'Open Twitter profile', category: 'Links', icon: '🔗' },
  { id: 'linkedin', label: 'LinkedIn', description: 'Open LinkedIn profile', category: 'Links', icon: '🔗' },
  { id: 'theme', label: 'Toggle Theme', description: 'Switch dark/light mode', category: 'Settings', icon: '🎨' },
  { id: 'share', label: 'Share Portfolio', description: 'Copy share link', category: 'Actions', icon: '📤' },
]

export default function CommandPalette({ isOpen, onClose, onNavigate, onAction }) {
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filtered = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSelect = (cmd) => {
    if (['home', 'work', 'about', 'blog', 'contact'].includes(cmd.id)) {
      onNavigate(cmd.id)
    } else {
      onAction(cmd.id)
    }
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) handleSelect(filtered[selectedIndex])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="command-palette-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="command-palette"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="command-palette-input-wrapper">
              <span className="command-palette-icon">⌘</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search commands... (Try ⌘K)"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                className="command-palette-input"
              />
              <button onClick={onClose} className="command-palette-close">
                ESC
              </button>
            </div>

            <div className="command-palette-results">
              {filtered.length === 0 ? (
                <div className="command-palette-empty">
                  <p>No commands found for "{search}"</p>
                </div>
              ) : (
                filtered.map((cmd, i) => (
                  <motion.button
                    key={cmd.id}
                    className={`command-palette-item ${i === selectedIndex ? 'active' : ''}`}
                    onClick={() => handleSelect(cmd)}
                    whileHover={{ backgroundColor: 'rgba(200, 169, 110, 0.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="command-palette-item-content">
                      {cmd.icon && <span className="command-palette-item-icon">{cmd.icon}</span>}
                      <div className="command-palette-item-text">
                        <div className="command-palette-item-label">{cmd.label}</div>
                        <div className="command-palette-item-description">{cmd.description}</div>
                      </div>
                    </div>
                    <span className="command-palette-item-category">{cmd.category}</span>
                  </motion.button>
                ))
              )}
            </div>

            <div className="command-palette-footer">
              <small>↑↓ Navigate • ENTER Select • ESC Close</small>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
