import { useEffect, useState } from 'react'
import { backend } from '../data'
import type { useClassData } from '../data/hooks'
import type { ClassroomCourse, Lesson } from '../types'
import { LESSONS_IN_ORDER, TRACK_INFO } from '../curriculum'
import { GRADE_WEIGHTS, gradesFor } from '../lib/grades'
import { timeAgo, useAction } from '../components/ui'

type Data = ReturnType<typeof useClassData>

/** Text for the Classroom assignment that goes with a lesson. */
export function assignmentFor(lesson: Lesson, points: number) {
  return {
    lessonId: lesson.id,
    title: `AppVenture: ${lesson.title}`,
    points,
    description: [
      lesson.subtitle,
      '',
      `Build: ${lesson.project.name}. ${lesson.project.description}`,
      '',
      'You will:',
      ...lesson.objectives.map((o) => `• ${o}`),
      '',
      `Grade: ${Math.round(GRADE_WEIGHTS.quiz * 100)}% your own quiz score + ${Math.round(GRADE_WEIGHTS.build * 100)}% when your build is approved (+${Math.round(GRADE_WEIGHTS.bonus * 100)}% extra credit for the bonus quest).`,
      'Open the lesson with the "Open in AppVenture" link.',
    ].join('\n'),
  }
}

export function CourseList({ onPick, busyLabel }: { onPick: (c: ClassroomCourse) => void; busyLabel: string }) {
  const [courses, setCourses] = useState<ClassroomCourse[] | null>(null)
  const { busy, error, run } = useAction()
  useEffect(() => {
    void run(async () => setCourses((await backend.classroom!.listCourses()) ?? []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (error) return <p className="error">{error}</p>
  if (!courses) return <p className="muted">Loading your Google Classroom courses…</p>
  if (!courses.length) return <p className="muted">No active Classroom courses where you're a teacher.</p>
  return (
    <div className="stack">
      {courses.map((c) => (
        <div key={c.id} className="spread card soft" style={{ padding: 12 }}>
          <div>
            <strong>{c.name}</strong>
            {c.section && <span className="muted"> · {c.section}</span>}
          </div>
          <button className="small primary" disabled={busy} onClick={() => onPick(c)}>
            {busyLabel}
          </button>
        </div>
      ))}
    </div>
  )
}

export function ClassroomTab({ data }: { data: Data }) {
  const cls = data.cls!
  const link = cls.classroom
  const { busy, error, run } = useAction()
  const [msg, setMsg] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [points, setPoints] = useState(100)
  const [publish, setPublish] = useState(false)

  if (!backend.classroom) return <div className="card">Google Classroom works in the Google Apps Script version (see DEPLOY.md).</div>

  if (!link)
    return (
      <div className="card">
        <h3>🎓 Link to Google Classroom</h3>
        <p className="muted">Pick the course this class matches. Its students are added here with their first name and last initial.</p>
        <CourseList
          busyLabel="Link"
          onPick={(c) =>
            void run(async () => {
              const r = await backend.classroom!.importCourse(c.id, cls.id)
              setMsg(`Linked. ${r.added} new student${r.added === 1 ? '' : 's'} added (${r.total} in the course).`)
            })
          }
        />
        {error && <p className="error">{error}</p>}
      </div>
    )

  const made = link.coursework
  const remaining = LESSONS_IN_ORDER.filter((l) => !made[l.id])
  const toggle = (id: string) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  const pickTrack = (tracks: Lesson['track'][]) => setSelected([...new Set([...selected, ...remaining.filter((l) => tracks.includes(l.track)).map((l) => l.id)])])

  const sendGrades = () =>
    run(async () => {
      const grades = LESSONS_IN_ORDER.filter((l) => made[l.id]).flatMap((l) =>
        gradesFor(l.id, made[l.id].points, data.companies ?? [], data.progress, !!l.individual),
      )
      if (!grades.length) {
        setMsg('No grades to send yet. Students need a quiz attempt or an approved build on a lesson that has an assignment.')
        return
      }
      const r = await backend.classroom!.pushGrades(cls.id, grades)
      setMsg(
        `Sent ${r.updated} draft grade${r.updated === 1 ? '' : 's'}` +
          (r.unchanged ? `, ${r.unchanged} already up to date` : '') +
          (r.skipped ? `, ${r.skipped} skipped (student not in the Classroom course)` : '') +
          '. Now open each assignment in Classroom, check the grades, and click Return.' +
          (r.errors.length ? ` Problems: ${r.errors.slice(0, 3).join('; ')}` : ''),
      )
    })

  return (
    <div className="stack">
      {msg && <div className="alert good">{msg}</div>}
      {error && <div className="alert bad">{error}</div>}
      <div className="grid cols-2">
        <div className="card">
          <h3>🎓 {link.courseName}</h3>
          <p className="small muted">
            Roster last synced {link.lastRosterSync ? timeAgo(link.lastRosterSync) : 'never'}. New students in Classroom are added with their first name and
            last initial.
          </p>
          <button
            disabled={busy}
            onClick={() =>
              void run(async () => {
                const r = await backend.classroom!.syncRoster(cls.id)
                setMsg(`Roster synced: ${r.added} new, ${r.total} in the course.`)
              })
            }
          >
            🔄 Sync roster
          </button>
        </div>
        <div className="card">
          <h3>📊 Send grades to Classroom</h3>
          <p className="small">
            Each student's grade per lesson: <strong>{Math.round(GRADE_WEIGHTS.quiz * 100)}%</strong> their own best quiz score +{' '}
            <strong>{Math.round(GRADE_WEIGHTS.build * 100)}%</strong> when the build is approved, +{Math.round(GRADE_WEIGHTS.bonus * 100)}% extra credit for an approved
            bonus quest. Students who haven't started are left blank.
          </p>
          <p className="small muted">
            Grades go in as <strong>drafts</strong>. You review them and click <strong>Return</strong> in Classroom, and returned grades sync to PowerSchool as usual.
          </p>
          <button className="gold" disabled={busy || !Object.keys(made).length} onClick={() => void sendGrades()}>
            📤 Send draft grades
          </button>
          {link.lastGradeSync && <span className="small muted"> Last sent {timeAgo(link.lastGradeSync)}</span>}
        </div>
      </div>

      <div className="card">
        <div className="spread">
          <h3 style={{ margin: 0 }}>📝 Classroom assignments</h3>
          <div className="row small">
            <button className="small" onClick={() => pickTrack(['core'])}>
              Select core lessons
            </button>
            <button className="small" onClick={() => setSelected(remaining.map((l) => l.id))}>
              Select all
            </button>
            <button className="small ghost" onClick={() => setSelected([])}>
              Clear
            </button>
          </div>
        </div>
        <p className="small muted">
          Each assignment gets the lesson summary and an "Open in AppVenture" link straight to the lesson, under an "AppVenture" topic. Make assignments for
          the lessons every company does; for branch lessons, make only the ones your companies picked.
        </p>
        <div className="table-wrap">
          <table className="list">
            <tbody>
              {LESSONS_IN_ORDER.map((l) => {
                const cw = made[l.id]
                return (
                  <tr key={l.id}>
                    <td style={{ width: 36 }}>
                      {cw ? (
                        '✅'
                      ) : (
                        <input type="checkbox" checked={selected.includes(l.id)} onChange={() => toggle(l.id)} style={{ width: 20, height: 20 }} aria-label={`Select ${l.title}`} />
                      )}
                    </td>
                    <td>
                      {l.icon} <strong>{l.title}</strong>
                    </td>
                    <td>
                      <span className="chip" style={{ background: TRACK_INFO[l.track].color, color: '#fff', borderColor: 'transparent' }}>
                        {TRACK_INFO[l.track].label}
                      </span>
                    </td>
                    <td className="small">
                      {cw ? (
                        <a href={cw.link} target="_blank" rel="noreferrer">
                          Open in Classroom ↗ ({cw.points} pts)
                        </a>
                      ) : (
                        <span className="muted">not created</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="row" style={{ marginTop: 14 }}>
          <label className="row small" style={{ gap: 6, fontWeight: 800 }}>
            Points each
            <input type="number" min={1} max={1000} value={points} onChange={(e) => setPoints(Number(e.target.value) || 100)} style={{ width: 90 }} />
          </label>
          <label className="row small" style={{ gap: 6, fontWeight: 800 }}>
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} style={{ width: 20, height: 20 }} />
            Publish now (otherwise saved as drafts)
          </label>
          <button
            className="go"
            disabled={busy || !selected.length}
            onClick={() =>
              void run(async () => {
                const items = LESSONS_IN_ORDER.filter((l) => selected.includes(l.id)).map((l) => assignmentFor(l, points))
                const r = await backend.classroom!.createAssignments(cls.id, items, publish)
                const bad = r.filter((x) => !x.ok)
                setSelected([])
                setMsg(`Created ${r.filter((x) => x.ok && !x.error).length} assignment(s)${publish ? '' : ' as drafts'}.${bad.length ? ' Problems: ' + bad.map((b) => b.error).join('; ') : ''}`)
              })
            }
          >
            Create {selected.length || ''} assignment{selected.length === 1 ? '' : 's'}
          </button>
        </div>
      </div>
    </div>
  )
}
