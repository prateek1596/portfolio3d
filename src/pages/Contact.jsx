import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from '../components/MagneticButton'

const EMAIL_ADDRESS = 'prateekyadav1596@gmail.com'
const MAILTO_HREF = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent('Opportunity / Collaboration')}&body=${encodeURIComponent('Hi Prateek,%0D%0A%0D%0AI came across your portfolio and would like to connect regarding...%0D%0A%0D%0ABest,%0D%0A')}`
// Gmail web compose link with CC to your address (used for 'Open mail' action)
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}&cc=${encodeURIComponent(EMAIL_ADDRESS)}&su=${encodeURIComponent('Opportunity / Collaboration')}&body=${encodeURIComponent('Hi Prateek,%0D%0A%0D%0AI came across your portfolio and would like to connect regarding...%0D%0A%0D%0ABest,%0D%0A')}`

const LINKS = [
  { label: 'GitHub',   href: 'https://github.com/prateek1596',   icon: '⌥' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/prateek-yadav-b9094127b/', icon: '⊞' },
  { label: 'Email',    href: GMAIL_COMPOSE,   icon: '◎' },
]

// EmailJS config — fill in your own IDs after signup at emailjs.com (free)
const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'

async function sendEmail(data) {
  // If EmailJS config is not set, surface helpful error
  if ([EMAILJS_SERVICE, EMAILJS_TEMPLATE, EMAILJS_KEY].some(v => !v || v.startsWith('YOUR_'))) {
    throw new Error('EmailJS not configured. Set EMAILJS_SERVICE, EMAILJS_TEMPLATE, and EMAILJS_KEY.')
  }

  // Dynamically import emailjs so it's code-split
  const emailjs = await import('@emailjs/browser')
  return emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
    from_name:  data.name,
    from_email: data.email,
    subject:    data.subject,
    message:    data.message,
  }, EMAILJS_KEY)
}

function InputField({ label, name, type = 'text', multiline = false, value, onChange, error }) {
  const [focused, setFocused] = useState(false)
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div style={{ position: 'relative', marginBottom: 20 }}>
      <motion.label
        animate={{
          y: focused || value ? -20 : 0,
          fontSize: focused || value ? '9px' : '11px',
          color: focused ? 'var(--cyan)' : 'var(--text-faint)',
          letterSpacing: focused || value ? '0.3em' : '0.15em',
        }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute', top: multiline ? 14 : 12, left: 0,
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
          pointerEvents: 'none', zIndex: 1, display: 'block',
        }}
      >
        {label}
      </motion.label>

      <Tag
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={multiline ? 4 : undefined}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: `1px solid ${error ? 'var(--red)' : focused ? 'var(--cyan)' : 'var(--rule-soft)'}`,
          color: 'var(--text)',
          fontFamily: 'var(--font-serif)',
          fontSize: 15,
          padding: '10px 0 8px',
          marginTop: 16,
          outline: 'none',
          import { motion } from 'framer-motion'

          const EMAIL_ADDRESS = 'prateekyadav1596@gmail.com'
          const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL_ADDRESS)}&cc=${encodeURIComponent(EMAIL_ADDRESS)}`

          const LINKS = [
            { label: 'GitHub',   href: 'https://github.com/prateek1596',   icon: '⌥' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/prateek-yadav-b9094127b/', icon: '⊞' },
            { label: 'Email',    href: GMAIL_COMPOSE,   icon: '◎' },
          ]

          export default function Contact({ visible }) {
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute', inset: 0, overflowY: 'auto',
                  pointerEvents: visible ? 'all' : 'none',
                }}
              >
                <div style={{
                  minHeight: '100%',
                  display: 'grid', gridTemplateColumns: 'minmax(0, 1.02fr) minmax(0, 0.98fr)',
                  gap: 0, columnGap: 0, maxWidth: 1100, margin: '0 auto',
                  padding: '48px 8vw',
                }}>

                  {/* Left — big type + blurb */}
                  <div style={{ paddingRight: 60 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
                      transition={{ delay: 0.1 }}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}
                    >
                      Let's build something
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
                      transition={{ delay: 0.2, duration: 0.65 }}
                      style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.88, letterSpacing: '-0.01em', marginBottom: 32 }}
                    >
                      <div>GET IN</div>
                      <div style={{ WebkitTextStroke: '1.5px var(--cyan)', color: 'transparent' }}>TOUCH</div>
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
                      transition={{ delay: 0.35 }}
                      style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: 340, marginBottom: 36 }}
                    >
                      Open to full-time roles, freelance projects, and interesting collaborations.
                      Based in Chennai — available remotely worldwide.
                    </motion.p>

                    {/* Availability badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
                      transition={{ delay: 0.45 }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: '1px solid var(--panel-border)', padding: '9px 18px', marginBottom: 36, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--cyan)' }}
                    >
                      <span style={{ width: 7, height: 7, background: 'var(--cyan)', borderRadius: '50%', animation: 'blinkDot 1.2s infinite', display: 'inline-block' }} />
                      Available for work
                    </motion.div>
                  </div>

                  {/* Right — simplified: quick actions + social links (form removed) */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 30 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ borderLeft: '1px solid var(--rule-soft)', paddingLeft: 60, minWidth: 0 }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 18 }}>
                      Quick contact
                    </div>

                    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                      <button
                        onClick={() => navigator.clipboard.writeText(EMAIL_ADDRESS)}
                        style={{ padding: '12px 14px', border: '1px solid var(--panel-border)', background: 'rgba(255,255,255,0.02)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}
                      >
                        Copy email
                      </button>

                      <a href={GMAIL_COMPOSE} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 14px', border: '1px solid var(--panel-border-strong)', background: 'linear-gradient(180deg, rgba(200,169,110,0.12), rgba(200,169,110,0.04))', color: 'var(--gold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        Open Gmail
                      </a>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
                      transition={{ delay: 0.6 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}
                    >
                      {LINKS.map((link, i) => (
                        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none', padding: '8px 0' }}>
                          <span style={{ fontSize: 16 }}>{link.icon}</span>
                          {link.label}
                          <span style={{ marginLeft: 'auto', fontSize: 14, opacity: 0.4 }}>→</span>
                        </a>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>

                <style>{`
                  @keyframes blinkDot { 0%,100%{opacity:1} 50%{opacity:.15} }
                `}</style>
              </motion.div>
            )
          }
            Open to full-time roles, freelance projects, and interesting collaborations.
