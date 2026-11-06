import { Link } from 'react-router-dom'
import { LESSONS_IN_ORDER, TRACK_INFO } from '../curriculum'
import type { Track } from '../types'
import { alignmentFor } from '../curriculum/alignment'

const ORDER: Track[] = ['core', 'mini', 'side', 'games', 'media', 'tools', 'launch']

export function Library() {
  const totalPeriods = LESSONS_IN_ORDER.reduce((s, l) => s + l.periods, 0)
  return (
    <div className="page">
      <h1>📚 Curriculum</h1>
      <p className="muted">
        {LESSONS_IN_ORDER.length} lessons, about {totalPeriods} class periods in all. A company takes 13 required lessons: 7 core, 1 first
        product, 4 on their studio path, and Launch Day. Side quests are optional.
      </p>
      <p>
        <Link to="/standards" className="btn small">
          📏 MA DLCS standards alignment
        </Link>
      </p>
      {ORDER.map((track) => {
        const lessons = LESSONS_IN_ORDER.filter((l) => l.track === track)
        if (!lessons.length) return null
        const info = TRACK_INFO[track]
        return (
          <section key={track} style={{ marginBottom: 28 }}>
            <h2 style={{ color: info.color }}>{info.label}</h2>
            {track === 'mini' && <p className="muted small">Branch 1: each company picks ONE of these.</p>}
            {['games', 'media', 'tools'].includes(track) && <p className="muted small">Branch 2: companies that choose this studio take all four.</p>}
            <div className="grid cols-3">
              {lessons.map((l) => (
                <Link key={l.id} to={`/lessons/${l.id}`} className="card" style={{ borderTop: `4px solid ${info.color}` }}>
                  <div className="row" style={{ flexWrap: 'nowrap' }}>
                    <span style={{ fontSize: '1.8rem' }}>{l.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700 }}>{l.title}</div>
                      <div className="small muted">{l.subtitle}</div>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 4, marginTop: 10 }}>
                    {l.concepts.map((c) => (
                      <span key={c} className="chip">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="row" style={{ gap: 4, marginTop: 8 }}>
                    {alignmentFor(l.id).map((a) => (
                      <span key={a.code} className="chip brand" style={{ fontSize: '0.7rem' }} title="MA DLCS standard">
                        {a.code.replace('6-8.', '')}
                      </span>
                    ))}
                  </div>
                  <div className="small muted" style={{ marginTop: 8 }}>
                    🛠 {l.project.name} · ⏱ {l.periods} period{l.periods > 1 ? 's' : ''} · ⭐ {l.xp.quiz + l.xp.build}+{l.xp.bonus} XP
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
