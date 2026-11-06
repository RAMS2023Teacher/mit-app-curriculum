import { useState } from 'react'
import type { Company } from '../types'
import type { CompanyProgress } from '../lib/progress'
import { Logo } from './Logo'

/** Shield badge showing the company's level number. */
export function LevelBadge({ level, size = 56 }: { level: CompanyProgress['level']; size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" role="img" aria-label={`Level ${level.index + 1}: ${level.name}`} style={{ flex: 'none' }}>
      <path d="M50 4 L94 18 V52 C94 80 74 98 50 106 C26 98 6 80 6 52 V18 Z" fill="#1b2350" />
      <path d="M50 12 L86 23 V52 C86 75 70 90 50 97 C30 90 14 75 14 52 V23 Z" fill="url(#lvl)" />
      <defs>
        <linearGradient id="lvl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe066" />
          <stop offset="1" stopColor="#ff9f00" />
        </linearGradient>
      </defs>
      <text x="50" y="66" textAnchor="middle" fontFamily="Lilita One, sans-serif" fontSize="46" fill="#fff" stroke="#1b2350" strokeWidth="6" paintOrder="stroke">
        {level.index + 1}
      </text>
    </svg>
  )
}

export function XpBar({ progress, compact }: { progress: CompanyProgress; compact?: boolean }) {
  const { xp, level } = progress
  const pct = level.next ? Math.min(100, ((xp - level.min) / (level.next - level.min)) * 100) : 100
  return (
    <div className="row" style={{ flexWrap: 'nowrap', gap: 10 }}>
      {!compact && <LevelBadge level={level} size={46} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="spread small" style={{ marginBottom: 4, fontWeight: 900 }}>
          <span>
            {level.icon} {level.name}
          </span>
          {level.next && <span className="muted">next: {level.next}</span>}
        </div>
        <div className="xpbar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Experience points">
          <div style={{ width: `${pct}%` }} />
          <span>⭐ {xp} XP</span>
        </div>
      </div>
    </div>
  )
}

/** A short burst of confetti for wins. */
export function celebrate() {
  const box = document.createElement('div')
  box.className = 'confetti'
  const colors = ['#ffc928', '#33c95a', '#2f6bff', '#f0434f', '#9b51e0', '#11b39e']
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i')
    p.style.left = Math.random() * 100 + 'vw'
    p.style.background = colors[i % colors.length]
    p.style.animationDelay = Math.random() * 0.4 + 's'
    p.style.animationDuration = 1.4 + Math.random() + 's'
    box.appendChild(p)
  }
  document.body.appendChild(box)
  setTimeout(() => box.remove(), 2800)
}

export function CompanyName({ company, size = 32, sub }: { company: Company; size?: number; sub?: React.ReactNode }) {
  return (
    <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}>
      <Logo logo={company.logo} size={size} title={company.name} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{company.name}</div>
        {sub && <div className="small muted">{sub}</div>}
      </div>
    </div>
  )
}

export function timeAgo(t: number) {
  const s = Math.round((Date.now() - t) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)} min ago`
  if (s < 86400) return `${Math.round(s / 3600)} h ago`
  const d = Math.round(s / 86400)
  return d === 1 ? 'yesterday' : `${d} days ago`
}

/** Run an async action with busy + error state. */
export function useAction() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return false
    } finally {
      setBusy(false)
    }
  }
  return { busy, error, run, setError }
}

export function Loading() {
  return <div className="page center muted">Loading…</div>
}
