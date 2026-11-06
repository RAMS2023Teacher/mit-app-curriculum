import { Link } from 'react-router-dom'
import type { useClassData } from '../data/hooks'
import { getLesson, TRACK_INFO } from '../curriculum'
import { BRANCHES } from '../curriculum/tree'
import { Logo } from '../components/Logo'
import { XpBar } from '../components/ui'

type Data = ReturnType<typeof useClassData>

const ALL_BADGES = 13

export function StudentDashboard({ data }: { data: Data }) {
  const { cls, myCompany, progress, companies, submissions } = data
  const company = myCompany!
  const p = progress.get(company.id)!
  const ranked = [...(companies ?? [])].sort((a, b) => (progress.get(b.id)?.xp ?? 0) - (progress.get(a.id)?.xp ?? 0))
  const rank = ranked.findIndex((c) => c.id === company.id) + 1
  const forkId = p.position.startsWith('fork:') ? p.position.slice(5) : null
  const next = forkId ? null : getLesson(p.position)
  const nextStatus = next ? p.lessons[next.id]?.status : null
  const fixes = (submissions ?? []).filter((s) => s.status === 'returned' && p.lessons[s.lessonId]?.status === 'returned')
  const color = next ? TRACK_INFO[next.track].color : 'var(--mini)'

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="row" style={{ gap: 18, flexWrap: 'nowrap' }}>
          <div className="bob">
            <Logo logo={company.logo} size={92} title={company.name} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ marginBottom: 2 }}>{company.name}</h1>
            <div className="small muted" style={{ fontWeight: 800, marginBottom: 10 }}>
              {Object.values(company.memberNames).join(' + ')}
            </div>
            <XpBar progress={p} />
          </div>
        </div>
      </div>

      {fixes.map((s) => (
        <Link key={s.id} to={`/class/${cls!.id}/lesson/${s.lessonId}`} className="alert bad" style={{ display: 'block', textDecoration: 'none', color: 'var(--ink)' }}>
          ✏️ Your teacher wants a fix on <strong>{getLesson(s.lessonId)?.title}</strong>. Tap to see it →
        </Link>
      ))}

      <div
        className="lesson-hero"
        style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${color} 85%, #fff), ${color} 55%, color-mix(in srgb, ${color} 70%, #000))`, marginBottom: 20 }}
      >
        <div className="row" style={{ gap: 18 }}>
          <div className="big-icon bob">{forkId ? '🔀' : (next?.icon ?? '🏆')}</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 900, letterSpacing: '0.08em', fontSize: '0.85rem', opacity: 0.9 }}>NEXT MISSION</div>
            <h2 className="sky-title" style={{ fontSize: '2.1rem', margin: '2px 0' }}>
              {forkId ? BRANCHES[forkId].label : (next?.title ?? 'All done!')}
            </h2>
            <div style={{ fontWeight: 800 }}>{forkId ? 'Pick your path!' : next ? `Build: ${next.project.name}` : 'You finished the whole tree!'}</div>
          </div>
          {forkId ? (
            <Link className="btn gold big" to={`/class/${cls!.id}/tree`}>
              Choose 🔀
            </Link>
          ) : (
            next && (
              <Link className="btn go big" to={`/class/${cls!.id}/lesson/${next.id}`}>
                {nextStatus === 'available' ? 'PLAY ▶' : 'GO ▶'}
              </Link>
            )
          )}
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <Link to={`/class/${cls!.id}/leaderboard`} className="card tile">
          <div className="ic">🏆</div>
          <div className="n">#{rank}</div>
          <div className="l">Rank</div>
        </Link>
        <Link to={`/class/${cls!.id}/tree`} className="card tile">
          <div className="ic">🗺️</div>
          <div className="n">
            {p.completedCount}/{p.requiredCount}
          </div>
          <div className="l">Missions</div>
        </Link>
        <div className="card tile">
          <div className="ic">🏅</div>
          <div className="n">{p.badges.length}</div>
          <div className="l">Badges</div>
        </div>
        <Link to={`/class/${cls!.id}/company`} className="card tile">
          <div className="ic">🏢</div>
          <div className="n" style={{ fontSize: p.pathName ? '1.2rem' : undefined, lineHeight: p.pathName ? 1.9 : undefined }}>
            {p.pathName ?? '?'}
          </div>
          <div className="l">Studio</div>
        </Link>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h3>🏅 Badge shelf</h3>
          <div className="row" style={{ gap: 10 }}>
            {p.badges.map((b) => (
              <span key={b.id} title={`${b.name}: ${b.desc}`} aria-label={b.name} className="avatar" style={{ background: 'linear-gradient(180deg,#fff6d2,#ffd84a)' }}>
                {b.icon}
              </span>
            ))}
            {Array.from({ length: Math.max(0, Math.min(6, ALL_BADGES - p.badges.length)) }, (_, i) => (
              <span key={i} className="avatar" style={{ background: 'var(--panel-2)', borderStyle: 'dashed', borderColor: 'var(--ink-3)', opacity: 0.6 }} aria-hidden="true">
                ❔
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="spread">
            <h3 style={{ margin: 0 }}>🏆 Top companies</h3>
            <Link to={`/class/${cls!.id}/leaderboard`} className="small">
              See all
            </Link>
          </div>
          <div style={{ marginTop: 10 }}>
            {ranked.slice(0, 5).map((c, i) => (
              <div
                key={c.id}
                className="row"
                style={{
                  flexWrap: 'nowrap',
                  padding: '6px 8px',
                  borderRadius: 12,
                  background: c.id === company.id ? 'var(--warn-soft)' : undefined,
                  fontWeight: 800,
                }}
              >
                <span className="rank" style={{ fontSize: '1.2rem', width: 28 }}>
                  {['🥇', '🥈', '🥉'][i] ?? i + 1}
                </span>
                <Logo logo={c.logo} size={30} />
                <span style={{ flex: 1, minWidth: 0 }}>{c.name}</span>
                <span className="xp-num">⭐ {progress.get(c.id)?.xp ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
