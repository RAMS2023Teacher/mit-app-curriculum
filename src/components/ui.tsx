import { useState } from 'react'
import type { Company } from '../types'
import type { CompanyProgress } from '../lib/progress'
import { Logo } from './Logo'

export function XpBar({ progress }: { progress: CompanyProgress }) {
  const { xp, level } = progress
  const pct = level.next ? Math.min(100, ((xp - level.min) / (level.next - level.min)) * 100) : 100
  return (
    <div>
      <div className="spread small" style={{ marginBottom: 4 }}>
        <span>
          {level.icon} <strong>{level.name}</strong>
        </span>
        <span>
          <span className="xp-num">{xp} XP</span>
          {level.next && <span className="muted"> / {level.next} to level up</span>}
        </span>
      </div>
      <div className="xpbar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
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
