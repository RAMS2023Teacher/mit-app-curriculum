import { Link } from 'react-router-dom'
import type { useClassData } from '../data/hooks'
import { getLesson, TRACK_INFO } from '../curriculum'
import { BRANCHES } from '../curriculum/tree'
import { Logo } from '../components/Logo'
import { XpBar, timeAgo } from '../components/ui'
import { STATUS_LABEL } from '../lib/progress'

type Data = ReturnType<typeof useClassData>

export function StudentDashboard({ data }: { data: Data }) {
  const { cls, myCompany, progress, companies, submissions } = data
  const company = myCompany!
  const p = progress.get(company.id)!
  const ranked = [...(companies ?? [])].sort((a, b) => (progress.get(b.id)?.xp ?? 0) - (progress.get(a.id)?.xp ?? 0))
  const rank = ranked.findIndex((c) => c.id === company.id) + 1
  const fork = p.position.startsWith('fork:') ? BRANCHES[p.position.slice(5)] : null
  const next = fork ? null : getLesson(p.position)
  const nextStatus = next ? p.lessons[next.id]?.status : null
  const feedback = (submissions ?? []).filter((s) => s.status !== 'pending' && s.feedback).slice(0, 4)
  const returned = (submissions ?? []).filter((s) => s.status === 'returned' && p.lessons[s.lessonId]?.status === 'returned')

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="row" style={{ gap: 20, alignItems: 'center' }}>
          <Logo logo={company.logo} size={96} title={company.name} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div className="small muted">{cls!.name}</div>
            <h1 style={{ marginBottom: 2 }}>{company.name}</h1>
            {company.tagline && <div className="muted">“{company.tagline}”</div>}
            <div className="small" style={{ margin: '6px 0 10px' }}>
              {Object.values(company.memberNames).join(' · ')}
              {p.pathName && <span className="chip brand" style={{ marginLeft: 8 }}>🏢 {p.pathName}</span>}
            </div>
            <XpBar progress={p} />
          </div>
          <div className="row" style={{ gap: 24 }}>
            <div className="stat">
              <div className="n">#{rank}</div>
              <div className="l">of {ranked.length} companies</div>
            </div>
            <div className="stat">
              <div className="n">
                {p.completedCount}/{p.requiredCount}
              </div>
              <div className="l">lessons done</div>
            </div>
          </div>
        </div>
      </div>

      {returned.length > 0 && (
        <div className="alert bad">
          ✏️ Your teacher asked for changes on{' '}
          {returned.map((s, i) => (
            <span key={s.id}>
              {i > 0 && ', '}
              <Link to={`/class/${cls!.id}/lesson/${s.lessonId}`}>{getLesson(s.lessonId)?.title}</Link>
            </span>
          ))}
          .
        </div>
      )}

      <div className="grid cols-2">
        <div className="card">
          <h3>🎯 Your next mission</h3>
          {fork ? (
            <>
              <p>
                <strong>{BRANCHES[p.position.slice(5)].label}:</strong> {fork.description}
              </p>
              <Link className="btn btn-primary" to={`/class/${cls!.id}/tree`}>
                🔀 See your choices on the tree
              </Link>
            </>
          ) : next ? (
            <>
              <div className="row" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '2.2rem' }}>{next.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{next.title}</div>
                  <div className="small muted">{next.subtitle}</div>
                </div>
              </div>
              <div className="row small" style={{ marginBottom: 12 }}>
                <span className="chip" style={{ background: TRACK_INFO[next.track].color, color: '#fff' }}>
                  {TRACK_INFO[next.track].label}
                </span>
                {nextStatus && <span className="chip">{STATUS_LABEL[nextStatus]}</span>}
                <span className="chip">Project: {next.project.name}</span>
              </div>
              <Link className="btn btn-primary" to={`/class/${cls!.id}/lesson/${next.id}`}>
                {nextStatus === 'available' ? 'Start lesson →' : 'Continue →'}
              </Link>
            </>
          ) : (
            <p>🎉 You finished the whole tree! Amazing work.</p>
          )}
        </div>

        <div className="card">
          <h3>🏅 Badges</h3>
          {p.badges.length === 0 ? (
            <p className="muted">Finish your first lesson to earn your first badge.</p>
          ) : (
            <div className="row" style={{ gap: 8 }}>
              {p.badges.map((b) => (
                <span key={b.id} className="chip" title={b.desc} style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>💬 Teacher feedback</h3>
          {feedback.length === 0 ? (
            <p className="muted">Feedback on your builds will show up here.</p>
          ) : (
            feedback.map((s) => (
              <div key={s.id} style={{ marginBottom: 12 }}>
                <div className="row small">
                  <strong>{getLesson(s.lessonId)?.title}</strong>
                  <span className={`chip ${s.status === 'approved' ? 'good' : 'bad'}`}>{s.status === 'approved' ? 'Approved' : 'Needs changes'}</span>
                  <span className="muted">{s.reviewedAt ? timeAgo(s.reviewedAt) : ''}</span>
                </div>
                <div>{s.feedback}</div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3>🏆 Class leaderboard</h3>
          {ranked.slice(0, 5).map((c, i) => (
            <div key={c.id} className="row" style={{ marginBottom: 8, flexWrap: 'nowrap', fontWeight: c.id === company.id ? 700 : 400 }}>
              <span className="rank" style={{ fontSize: '1rem', width: 24 }}>
                {i + 1}
              </span>
              <Logo logo={c.logo} size={28} />
              <span style={{ flex: 1 }}>{c.name}</span>
              <span className="xp-num">{progress.get(c.id)?.xp ?? 0}</span>
            </div>
          ))}
          <Link to={`/class/${cls!.id}/leaderboard`} className="small">
            Full leaderboard →
          </Link>
        </div>
      </div>
    </div>
  )
}
