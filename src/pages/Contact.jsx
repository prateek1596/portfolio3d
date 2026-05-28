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
  { label: 'Email',    href: MAILTO_HREF,   icon: '◎' },
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
          resize: 'none',
          transition: 'border-color 0.25s',
          caretColor: 'var(--cyan)',
        }}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--red)', marginTop: 4, letterSpacing: '0.15em' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact({ visible, sounds }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [copied, setCopied] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Valid email required'
    if (!form.subject.trim()) e.subject = 'Required'
    if (form.message.trim().length < 10) e.message = 'At least 10 characters'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: null }))
  }

  const handleSubmit = async () => {
    sounds?.click()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setStatus('sending')
    try {
      await sendEmail(form)
      setStatus('success')
      sounds?.success()
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('Send email failed:', err)
      // Fallback: if EmailJS is not configured, open user's mail client with prefilled message
      if (err && String(err.message || '').toLowerCase().includes('emailjs not configured')) {
        const subject = encodeURIComponent(form.subject || 'Contact from portfolio')
        const body = encodeURIComponent(`${form.message || ''}\n\n---\nFrom: ${form.name || ''} <${form.email || ''}>`)
        const mailto = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`
        try { window.open(mailto, '_blank') } catch (openErr) { window.location.href = mailto }
      }
      setStatus('error')
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS)
      setCopied(true)
      sounds?.click()
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

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

        {/* Left — big type + links */}
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

          {/* Quick contact actions — moved into the right pane below the form (removed from left) */}

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
            transition={{ delay: 0.55 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {LINKS.map((link, i) => (
              (() => {
                const isMailto = link.href.startsWith('mailto:')
                return (
              <motion.a
                key={link.label}
                href={link.href}
                data-hover
                target={isMailto ? undefined : '_blank'}
                rel={isMailto ? undefined : 'noopener noreferrer'}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -12 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                whileHover={{ x: 6, color: 'var(--cyan)' }}
                onMouseEnter={() => sounds?.hover()}
                style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.25s', cursor: 'none', minHeight: 48 }}
              >
                <span style={{ fontSize: 16 }}>{link.icon}</span>
                {link.label}
                <span style={{ marginLeft: 'auto', fontSize: 14, opacity: 0.4 }}>→</span>
              </motion.a>
                )
              })()
            ))}
          </motion.div>
        </div>

        {/* Right — contact form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 30 }}
          transition={{ delay: 0.3, duration: 0.6 }}
            style={{ borderLeft: '1px solid var(--rule-soft)', paddingLeft: 60, minWidth: 0 }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 28 }}>
            Send a message
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '60px 20px' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: 48, marginBottom: 20 }}
                >
                  ✦
                </motion.div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--gold)', marginBottom: 12 }}>Message sent!</div>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text-muted)', fontSize: 15 }}>
                  I'll get back to you within 24 hours.
                </p>
                <motion.button
                  data-hover onClick={() => setStatus('idle')} whileHover={{ scale: 1.04 }}
                  style={{ marginTop: 28, background: 'none', border: '1px solid var(--panel-border)', color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '10px 22px', cursor: 'none' }}
                >
                  Send another →
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="form">
                <InputField label="Name" name="name" value={form.name} onChange={handleChange('name')} error={errors.name} />
                <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange('email')} error={errors.email} />
                <InputField label="Subject" name="subject" value={form.subject} onChange={handleChange('subject')} error={errors.subject} />
                <InputField label="Message" name="message" multiline value={form.message} onChange={handleChange('message')} error={errors.message} />

                {status === 'error' && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', marginBottom: 16, letterSpacing: '0.15em' }}>
                    ✕ Something went wrong. Try emailing directly.
                  </div>
                )}

                <MagneticButton
                  onClick={handleSubmit}
                  sounds={sounds}
                  style={{
                    marginTop: 8,
                    width: '100%',
                    padding: '14px 28px',
                    justifyContent: 'center',
                    background: status === 'sending' ? 'var(--panel-bg)' : 'none',
                  }}
                >
                  {status === 'sending' ? '◌ Sending...' : 'Send Message →'}
                </MagneticButton>
                <div aria-live="polite" style={{ minHeight: 18, marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-faint)' }}>
                  {copied ? 'Email copied to clipboard.' : ''}
                </div>

                {/* Quick contact actions moved here into right pane */}
                <div style={{ marginTop: 22, display: 'grid', gap: 10, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                  <motion.button
                    data-hover
                    onClick={handleCopyEmail}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      border: '1px solid var(--panel-border)',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '13px 16px',
                      color: copied ? 'var(--cyan)' : 'var(--text)',
                      fontFamily: 'var(--font-mono)', fontSize: 10,
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      textAlign: 'left',
                    }}
                  >
                    <span>{copied ? 'Copied' : 'Copy email'}</span>
                    <span aria-hidden="true">◎</span>
                  </motion.button>

                  <motion.a
                    href={GMAIL_COMPOSE}
                    data-hover
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                      border: '1px solid var(--panel-border-strong)',
                      background: 'linear-gradient(180deg, rgba(200,169,110,0.12), rgba(200,169,110,0.04))',
                      padding: '13px 16px',
                      color: 'var(--gold)',
                      fontFamily: 'var(--font-mono)', fontSize: 10,
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                    onClick={() => sounds?.click()}
                  >
                    <span>Open Gmail</span>
                    <span aria-hidden="true">→</span>
                  </motion.a>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid var(--panel-border)', padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
                    <span>Based in Chennai</span>
                    <span style={{ color: 'var(--text-soft)' }}>Remote worldwide</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes blinkDot { 0%,100%{opacity:1} 50%{opacity:.15} }
        input::placeholder, textarea::placeholder { color: transparent }
        input, textarea { cursor: text; }
        @media (max-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
