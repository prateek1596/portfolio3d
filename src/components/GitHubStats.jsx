import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function GitHubStats({ username = 'prateek1596' }) {
  const [stats, setStats] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        // Get user stats
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        if (!userRes.ok) throw new Error('User not found')
        const userData = await userRes.json()

        // Get repos
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
        )
        const reposData = await reposRes.json()

        setStats({
          name: userData.name,
          avatar: userData.avatar_url,
          bio: userData.bio,
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          company: userData.company,
          location: userData.location,
          blog: userData.blog,
          twitterHandle: userData.twitter_username,
        })

        setRepos(reposData.filter(r => !r.fork))
        setLoading(false)
      } catch (e) {
        setError(e?.message || 'Error fetching GitHub data')
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [username])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '20px',
          background: 'rgba(0, 212, 255, 0.05)',
          borderRadius: '4px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-faint)',
        }}
      >
        Loading GitHub stats...
      </motion.div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          background: 'rgba(255, 0, 110, 0.05)',
          borderRadius: '4px',
          color: 'var(--red)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
        }}
      >
        Error: {error}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginTop: '40px',
      }}
    >
      {/* Stats Summary */}
      <motion.div
        whileHover={{ y: -4 }}
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(255, 0, 110, 0.05))',
          border: '1px solid rgba(0, 212, 255, 0.1)',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          {stats.avatar && (
            <motion.img
              src={stats.avatar}
              alt={stats.name}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '12px',
                border: '2px solid var(--cyan)',
              }}
            />
          )}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-faint)', letterSpacing: '0.2em' }}>
              @{username}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{stats.name}</div>
          </div>
        </div>

        {stats.bio && (
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '16px', lineHeight: 1.4 }}>
            {stats.bio}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
          <StatItem label="Public Repos" value={stats.publicRepos} color="var(--cyan)" />
          <StatItem label="Followers" value={stats.followers} color="var(--gold)" />
          <StatItem label="Following" value={stats.following} color="var(--red)" />
          {stats.company && (
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: 'var(--text-faint)' }}>📌 {stats.company}</span>
            </div>
          )}
        </div>

        {stats.blog && (
          <a
            href={stats.blog}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '12px',
              fontSize: '11px',
              color: 'var(--cyan)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--cyan)',
              cursor: 'pointer',
            }}
          >
            {stats.blog.replace('https://', '')}
          </a>
        )}
      </motion.div>

      {/* Recent Repos */}
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-faint)', letterSpacing: '0.2em', marginBottom: '8px', textTransform: 'uppercase' }}>
          📦 Recent Projects
        </div>
        {repos.map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 4, color: 'var(--cyan)' }}
            style={{
              padding: '12px',
              background: 'rgba(0, 212, 255, 0.05)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: '12px',
              color: 'var(--text)',
              transition: 'all 0.2s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{repo.name}</div>
              {repo.description && (
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', lineHeight: 1.3 }}>
                  {repo.description.substring(0, 50)}...
                </div>
              )}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--gold)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
              ⭐ {repo.stargazers_count}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  )
}

function StatItem({ label, value, color }) {
  return (
    <div>
      <div style={{ color: 'var(--text-faint)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color, fontSize: '18px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  )
}
