import { motion } from 'framer-motion'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
  { label: 'Email', href: 'mailto:prateek@example.com' },
  { label: 'Resume', href: '#' },
]

export default function Contact({ visible }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 8vw', textAlign: 'center',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.5em', textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: 20,
        }}
      >
        Let's build something
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 13vw, 140px)',
          lineHeight: 0.88, letterSpacing: '-0.01em',
        }}
      >
        <div>GET IN</div>
        <div style={{ WebkitTextStroke: '1.5px var(--cyan)', color: 'transparent' }}>TOUCH</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.9 }}
        transition={{ delay: 0.4 }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 9,
          border: '1px solid rgba(0,232,255,0.3)',
          padding: '10px 22px', marginTop: 32,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--cyan)',
        }}
      >
        <span style={{
          width: 7, height: 7, background: 'var(--cyan)', borderRadius: '50%',
          animation: 'blinkDot 1.2s ease-in-out infinite',
          display: 'inline-block',
        }} />
        Available for opportunities
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: 36, marginTop: 44 }}
      >
        {LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            data-hover
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
            transition={{ delay: 0.55 + i * 0.08 }}
            whileHover={{ color: 'var(--cyan)', y: -2 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(242,236,224,0.45)',
              textDecoration: 'none',
              position: 'relative',
            }}
          >
            {link.label}
            <motion.div
              style={{
                position: 'absolute', bottom: -4, left: 0, right: 0,
                height: 1, background: 'var(--cyan)',
                scaleX: 0, originX: 0,
              }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.25 }}
            />
          </motion.a>
        ))}
      </motion.div>

      <style>{`
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </motion.div>
  )
}
