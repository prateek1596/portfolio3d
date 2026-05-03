import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from '../components/GlitchText'

const POSTS = [
  {
    id: 1, num: '001',
    title: 'Building MedPredict: 6 ML Models, One Interface',
    date: 'Apr 2025', readTime: '6 min',
    tags: ['ML', 'FastAPI', 'React'],
    excerpt: 'How I designed a multi-disease prediction system with SHAP explainability, fairness analysis, and counterfactual generation — and what I learned about deploying ML at scale.',
    body: `When I started MedPredict, the goal was simple: build one interface that could predict multiple diseases and explain *why* it made each prediction. What I ended up with was far more interesting.

**The Architecture Problem**

Six models (Logistic Regression, Random Forest, SVM, XGBoost, LightGBM, and a Stacking Ensemble) each needed their own feature pipelines. The naive approach — separate endpoints for each — would have made the frontend a nightmare. Instead, I built a single prediction engine that routes internally based on disease type.

**SHAP Changed Everything**

Adding SHAP explainability wasn't just a nice-to-have. It fundamentally changed how I thought about model outputs. When the model says "high risk," SHAP shows exactly which features pushed it there. That's the difference between a black box and a tool a doctor might actually trust.

**Fairness as a First-Class Concern**

Using the Fairlearn library, I ran bias audits across demographic groups. The results were humbling — some models performed 12% worse on certain subgroups. Addressing that required resampling and threshold calibration, not just model selection.

**What I'd Do Differently**

Redis caching saved the API, but I added it too late. On the first load test, the endpoint was taking 3.2 seconds per prediction. After caching the preprocessed feature matrices, it dropped to 180ms. Cache early.`,
  },
  {
    id: 2, num: '002',
    title: 'ManhwaVault: Scraping at Scale Without Getting Blocked',
    date: 'Mar 2025', readTime: '4 min',
    tags: ['React Native', 'FastAPI', 'Scraping'],
    excerpt: 'Building a mobile manhwa reader with a Git-based extension system for sources, and the cat-and-mouse game of keeping scrapers alive as sites update.',
    body: `The hardest part of ManhwaVault wasn't the React Native UI or the FastAPI backend. It was designing a scraper architecture that could survive source websites changing their HTML every few weeks.

**The Git Extension System**

Each manhwa source is its own Git repository following a standard interface: a \`scrape(url)\` function that returns a normalized chapter object. When a source breaks, users can update just that extension without touching the core app. This is the same pattern VS Code uses for language servers.

**Rate Limiting Done Right**

Naive scrapers get IP-banned in hours. My approach: exponential backoff with jitter, rotating request headers, and a per-domain request queue. The queue is the key — it prevents burst patterns that trigger bot detection.

**Push Notifications**

Phase 6 added background chapter checking via a scheduled FastAPI task. When a new chapter drops, the app sends a push notification through Expo's notification service. The tricky part: mapping scraper chapter IDs to user subscription records efficiently. A simple hash map in Redis solved it.`,
  },
  {
    id: 3, num: '003',
    title: 'Why I Built a Pokémon in VS Code',
    date: 'Jan 2025', readTime: '3 min',
    tags: ['TypeScript', 'VS Code', 'Fun'],
    excerpt: 'A VS Code extension where a Pokémon sprite follows your cursor and reacts to your editor state. Because developer tools should spark joy.',
    body: `This project started as a joke and ended up teaching me more about the VS Code Extension API than I expected.

**The WebView Problem**

VS Code extensions can't directly manipulate the editor UI. Everything visual happens inside a WebView — essentially an iframe with restricted capabilities. Getting the sprite to appear at the right position relative to the cursor required bridging editor events to WebView coordinates, which is surprisingly non-trivial.

**Event Architecture**

The extension listens to \`onDidChangeTextEditorSelection\` and \`onDidChangeActiveTextEditor\` events, normalizes the cursor position, and sends messages to the WebView via \`postMessage\`. The WebView renders the sprite and animates it based on received coordinates.

**What It Taught Me**

Building something silly and fun is underrated as a learning strategy. The constraints of the VS Code API forced me to think carefully about message passing, state synchronization, and animation performance in ways that pure tutorial projects never would.`,
  },
  {
    id: 4, num: '004',
    title: 'The Stack I Use for Every Project in 2025',
    date: 'Feb 2025', readTime: '5 min',
    tags: ['React', 'FastAPI', 'Architecture'],
    excerpt: 'React + Vite + FastAPI + PostgreSQL + Docker Compose + Nginx. Here\'s why I keep coming back to this combination and where it breaks down.',
    body: `After five production projects, I've converged on a stack that I reach for automatically. Here's what it is and why.

**Frontend: React + Vite + TailwindCSS**

Vite's HMR is fast enough that I've stopped noticing the dev/build distinction. Tailwind's utility classes let me move fast without fighting CSS specificity. React's ecosystem means I can find a library for almost anything.

**Backend: FastAPI + Pydantic**

FastAPI's automatic OpenAPI docs save hours of documentation time. Pydantic's validation catches bugs at the boundary before they propagate. The async support handles I/O-bound tasks cleanly, and the DI system makes testing straightforward.

**Data: PostgreSQL + Redis**

Postgres for persistent state, Redis for caching and job queues. This combination covers 95% of data needs without introducing complexity.

**Where It Breaks Down**

Real-time features beyond basic WebSockets need something like Supabase or a proper message broker. For ML inference at scale, the synchronous FastAPI approach falls apart — you need a task queue and worker pool. And for truly global deployments, a Python backend isn't the right call. For everything else? This stack ships fast.`,
  },
]

function PostCard({ post, index, visible, onOpen, sounds }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 24 }}
      transition={{ delay: 0.08 + index * 0.09, duration: 0.5 }}
      onMouseEnter={() => { setHovered(true); sounds?.hover() }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { onOpen(post); sounds?.click() }}
      data-hover
      style={{
        padding: '24px 0', borderBottom: '1px solid var(--rule-soft)',
        cursor: 'none', position: 'relative',
        paddingLeft: hovered ? 16 : 0, transition: 'padding-left 0.3s',
      }}
    >
      <motion.div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'var(--gold)', originY: 0.5 }}
        animate={{ scaleY: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-ghost)' }}>{post.num}</span>
            {post.tags.map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid var(--panel-border)', color: 'var(--gold)', padding: '2px 7px' }}>{t}</span>
            ))}
          </div>

          <GlitchText style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(17px, 2vw, 22px)', color: hovered ? 'var(--text)' : 'var(--text-soft)', transition: 'color 0.3s', display: 'block' }} sounds={sounds}>
            {post.title}
          </GlitchText>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', marginTop: 8, lineHeight: 1.6 }}>
            {post.excerpt}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-faint)', textTransform: 'uppercase' }}>{post.date}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--cyan)', marginTop: 4 }}>{post.readTime} read</div>
          <motion.div animate={{ x: hovered ? 4 : 0 }} style={{ fontSize: 18, color: hovered ? 'var(--gold)' : 'var(--text-ghost)', marginTop: 8, transition: 'color 0.2s' }}>→</motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function PostModal({ post, onClose, sounds }) {
  const paragraphs = post.body.split('\n\n')
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--glass-bg-strong)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 5vw', overflowY: 'auto' }}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 680, background: 'var(--panel-bg-elevated)', border: '1px solid var(--panel-border)', padding: '48px 52px', position: 'relative', marginBottom: 40 }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold)' }} />
        <button onClick={() => { onClose(); sounds?.click() }} data-hover style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: 22, cursor: 'none' }}>×</button>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>{post.date} · {post.readTime} read</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {post.tags.map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid var(--panel-border)', color: 'var(--gold)', padding: '2px 8px' }}>{t}</span>)}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 46px)', lineHeight: 1, marginBottom: 28 }}>{post.title}</h2>
        <div style={{ height: 1, background: 'var(--rule-soft)', marginBottom: 28 }} />

        {paragraphs.map((p, i) => {
          if (p.startsWith('**') && p.endsWith('**')) {
            return <h3 key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginBottom: 10, marginTop: i > 0 ? 24 : 0, letterSpacing: '0.05em' }}>{p.replace(/\*\*/g, '')}</h3>
          }
          return <p key={i} style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 16 }}>{p.replace(/\*\*/g, '')}</p>
        })}
      </motion.div>
    </motion.div>
  )
}

export default function Blog({ visible, sounds }) {
  const [modal, setModal] = useState(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', padding: '40px 8vw', pointerEvents: visible ? 'all' : 'none', overflowY: 'auto' }}
      >
        <div style={{ width: '100%', maxWidth: 720, paddingBottom: 40 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }} transition={{ delay: 0.05 }}
            style={{ marginBottom: 8 }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--red)' }}>Writing</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'var(--text-ghost)', marginLeft: 16 }}>— thoughts on building things</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }} transition={{ delay: 0.12, duration: 0.6 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 0.9, marginBottom: 36 }}
          >
            <div>NOTES FROM</div>
            <div style={{ WebkitTextStroke: '1.5px var(--gold)', color: 'transparent' }}>THE BUILD.</div>
          </motion.div>
          {POSTS.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} visible={visible} onOpen={setModal} sounds={sounds} />
          ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {modal && <PostModal post={modal} onClose={() => setModal(null)} sounds={sounds} />}
      </AnimatePresence>
    </>
  )
}
