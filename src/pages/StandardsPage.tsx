import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STANDARDS, STRANDS, type Standard } from '../curriculum/standards'
import { ALIGNMENT } from '../curriculum/alignment'
import { getLesson, LESSONS_IN_ORDER } from '../curriculum'

/** Which lessons address each standard, in tree order. */
function lessonsByStandard() {
  const map = new Map<string, { lessonId: string; how: string }[]>()
  for (const l of LESSONS_IN_ORDER) {
    for (const a of ALIGNMENT[l.id] ?? []) {
      const list = map.get(a.code) ?? []
      list.push({ lessonId: l.id, how: a.how })
      map.set(a.code, list)
    }
  }
  return map
}

export function StandardsPage() {
  const [gapsOnly, setGapsOnly] = useState(false)
  const [strand, setStrand] = useState<Standard['strand'] | 'all'>('all')
  const map = lessonsByStandard()
  const covered = STANDARDS.filter((s) => map.has(s.code)).length
  const strands = Object.keys(STRANDS) as Standard['strand'][]

  return (
    <div className="page">
      <h1 className="sky-title">📏 Standards alignment</h1>
      <p style={{ fontWeight: 800, maxWidth: '70ch' }}>
        Massachusetts Digital Literacy and Computer Science Framework (2016), grades 6–8. AppVenture addresses{' '}
        <strong>
          {covered} of {STANDARDS.length}
        </strong>{' '}
        standards. Gaps are listed too, so you can cover them elsewhere in your course.
      </p>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        {strands.map((st) => {
          const all = STANDARDS.filter((s) => s.strand === st)
          const n = all.filter((s) => map.has(s.code)).length
          return (
            <button key={st} className={`card tile ${strand === st ? 'on' : ''}`} onClick={() => setStrand(strand === st ? 'all' : st)} aria-pressed={strand === st} style={strand === st ? { background: 'var(--warn-soft)' } : undefined}>
              <span className="n" style={{ display: 'block' }}>
                {n}/{all.length}
              </span>
              <span className="l" style={{ display: 'block' }}>
                {STRANDS[st]}
              </span>
              <span className="xpbar" style={{ display: 'block', height: 14, marginTop: 8, borderWidth: 2 }}>
                <span style={{ display: 'block', position: 'static', height: '100%', width: `${(n / all.length) * 100}%`, background: 'linear-gradient(180deg,#5fe07f,#33c95a)', borderRadius: 999 }} />
              </span>
            </button>
          )
        })}
      </div>

      <label className="row" style={{ gap: 8, fontWeight: 800, marginBottom: 16 }}>
        <input type="checkbox" checked={gapsOnly} onChange={(e) => setGapsOnly(e.target.checked)} style={{ width: 22, height: 22 }} />
        Show only standards not covered yet
      </label>

      {strands
        .filter((st) => strand === 'all' || strand === st)
        .map((st) => {
          const clusters = [...new Set(STANDARDS.filter((s) => s.strand === st).map((s) => s.cluster))]
          return (
            <section key={st} className="card" style={{ marginBottom: 20 }}>
              <h2>
                {STRANDS[st]} <span className="chip">{st}</span>
              </h2>
              {clusters.map((cluster) => {
                const rows = STANDARDS.filter((s) => s.strand === st && s.cluster === cluster && (!gapsOnly || !map.has(s.code)))
                if (!rows.length) return null
                return (
                  <div key={cluster} style={{ marginBottom: 16 }}>
                    <h3 style={{ color: 'var(--ink-2)' }}>{cluster}</h3>
                    <div className="table-wrap">
                      <table className="list">
                        <tbody>
                          {rows.map((s) => {
                            const lessons = map.get(s.code) ?? []
                            return (
                              <tr key={s.code}>
                                <td style={{ width: 110, verticalAlign: 'top' }}>
                                  <span className={`chip ${lessons.length ? 'good' : ''}`}>{s.code.replace('6-8.', '')}</span>
                                </td>
                                <td style={{ verticalAlign: 'top', minWidth: 220 }}>{s.text}</td>
                                <td style={{ verticalAlign: 'top', minWidth: 200 }}>
                                  {lessons.length === 0 ? (
                                    <span className="muted small">Not covered yet</span>
                                  ) : (
                                    <div className="row" style={{ gap: 6 }}>
                                      {lessons.map(({ lessonId, how }) => {
                                        const l = getLesson(lessonId)!
                                        return (
                                          <Link key={lessonId} to={`/lessons/${lessonId}`} className="chip brand" title={how} style={{ textDecoration: 'none' }}>
                                            {l.icon} {l.title}
                                          </Link>
                                        )
                                      })}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </section>
          )
        })}
      <p className="small muted">
        Standard text is quoted from the{' '}
        <a href="https://www.doe.mass.edu/frameworks/dlcs.pdf" target="_blank" rel="noreferrer">
          2016 Massachusetts DLCS Curriculum Framework
        </a>
        . The alignment lives in <code>src/curriculum/alignment.ts</code>.
      </p>
    </div>
  )
}
