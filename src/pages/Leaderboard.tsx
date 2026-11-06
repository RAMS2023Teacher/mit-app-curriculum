import { useParams } from 'react-router-dom'
import { useClassData } from '../data/hooks'
import { Logo } from '../components/Logo'
import { Loading } from '../components/ui'

export function Leaderboard() {
  const { classId } = useParams()
  const data = useClassData(classId)
  if (data.loading) return <Loading />
  const ranked = [...(data.companies ?? [])].sort((a, b) => (data.progress.get(b.id)?.xp ?? 0) - (data.progress.get(a.id)?.xp ?? 0))
  const medals = ['🥇', '🥈', '🥉']
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <h1>🏆 Leaderboard</h1>
      <p className="muted">{data.cls?.name}</p>
      <div className="stack">
        {ranked.map((c, i) => {
          const p = data.progress.get(c.id)!
          const mine = c.id === data.myCompany?.id
          return (
            <div key={c.id} className="card row" style={{ flexWrap: 'nowrap', borderColor: mine ? 'var(--xp)' : undefined, borderWidth: mine ? 2 : 1 }}>
              <div className="rank">{medals[i] ?? i + 1}</div>
              <Logo logo={c.logo} size={56} title={c.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {c.name} {mine && <span className="chip brand">You</span>}
                </div>
                <div className="small muted">
                  {Object.values(c.memberNames).join(' · ')} · {p.level.icon} {p.level.name}
                  {p.pathName && ` · ${p.pathName}`}
                </div>
                <div className="small" style={{ marginTop: 4 }}>
                  {p.badges.map((b) => (
                    <span key={b.id} title={b.name} style={{ marginRight: 4 }}>
                      {b.icon}
                    </span>
                  ))}
                </div>
              </div>
              <div className="stat">
                <div className="n xp-num">{p.xp}</div>
                <div className="l">XP</div>
              </div>
            </div>
          )
        })}
        {ranked.length === 0 && <p className="muted">No companies yet.</p>}
      </div>
    </div>
  )
}
