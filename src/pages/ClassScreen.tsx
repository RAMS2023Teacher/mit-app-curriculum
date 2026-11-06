import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { backend } from '../data'
import { useClassData } from '../data/hooks'
import type { ClassBoard, Company } from '../types'
import { getLesson } from '../curriculum'
import { BRANCHES } from '../curriculum/tree'
import { Logo } from '../components/Logo'
import { LevelBadge, Loading, timeAgo, useAction } from '../components/ui'

const EMPTY_BOARD: ClassBoard = { goal: '', question: '', answer: '', timerEnd: null }

/** The 14 stops every company passes, in order (studio lessons depend on the chosen path). */
const STOPS = ['👋', '⚡', '📦', '🔀', '🧪', '🔁', '📋', '🧩', '🏢', '🏢', '🏢', '🏆', '🚀', '🧗']

function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => clearInterval(t)
  }, [ms])
  return now
}

const two = (n: number) => String(n).padStart(2, '0')

export function ClassScreen() {
  const { classId } = useParams()
  const data = useClassData(classId)
  const now = useNow()
  const [editing, setEditing] = useState(false)
  const [reveal, setReveal] = useState(false)
  const board = data.cls?.board ?? EMPTY_BOARD

  const companies = useMemo(
    () => [...(data.companies ?? [])].sort((a, b) => (data.progress.get(b.id)?.xp ?? 0) - (data.progress.get(a.id)?.xp ?? 0)),
    [data.companies, data.progress],
  )

  // Question of the day: the teacher's, or one from the lesson most companies are on (changes daily).
  const autoQ = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of companies) {
      const pos = data.progress.get(c.id)?.position ?? ''
      if (!pos.startsWith('fork:')) counts.set(pos, (counts.get(pos) ?? 0) + 1)
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    const lesson = getLesson(top ?? 'core-hello') ?? getLesson('core-hello')!
    const day = Math.floor(Date.now() / 86_400_000)
    const q = lesson.quiz[day % lesson.quiz.length]
    return { lesson, q }
  }, [companies, data.progress])

  // Recent wins: approved builds and passed quizzes.
  const wins = useMemo(() => {
    const out: { at: number; icon: string; text: string; company?: Company }[] = []
    const byId = new Map(companies.map((c) => [c.id, c]))
    for (const a of data.approvals ?? []) {
      const c = byId.get(a.companyId)
      const l = getLesson(a.lessonId)
      if (!c || !l) continue
      const who = a.uid ? c.memberNames[a.uid] : c.name
      out.push({ at: a.at, icon: a.bonus ? '⭐' : '🚀', company: c, text: `${who} shipped ${l.project.name}${a.bonus ? ' + bonus quest' : ''}` })
    }
    for (const c of companies) {
      for (const [lessonId, byUser] of Object.entries(c.quizzes)) {
        const l = getLesson(lessonId)
        for (const r of Object.values(byUser)) {
          if (r.excused || !l || r.total === 0 || r.score / r.total < (data.cls?.settings.quizPassPercent ?? 70) / 100) continue
          out.push({ at: r.at, icon: r.score === r.total ? '💯' : '🧠', company: c, text: `${r.byName} passed the ${l.title} quiz` })
        }
      }
    }
    return out.sort((a, b) => b.at - a.at).slice(0, 6)
  }, [companies, data.approvals, data.cls])

  // Peer help: for each lesson a company is on now, who has already finished it?
  const experts = useMemo(() => {
    const current = new Map<string, string[]>()
    for (const c of companies) {
      const pos = data.progress.get(c.id)?.position ?? ''
      if (!pos || pos.startsWith('fork:')) continue
      current.set(pos, [...(current.get(pos) ?? []), c.id])
    }
    return [...current.entries()]
      .map(([lessonId, here]) => ({
        lesson: getLesson(lessonId)!,
        done: companies.filter((c) => !here.includes(c.id) && data.progress.get(c.id)?.lessons[lessonId]?.status === 'complete'),
      }))
      .filter((e) => e.lesson && e.done.length > 0)
      .slice(0, 4)
  }, [companies, data.progress])

  if (data.loading) return <Loading />
  if (!data.cls) return <div className="page">Class not found.</div>
  if (!data.isTeacher) return <div className="page">Only the teacher can open the Class Screen.</div>

  const d = new Date(now)
  const clock = `${((d.getHours() + 11) % 12) + 1}:${two(d.getMinutes())}`
  const left = board.timerEnd ? Math.max(0, Math.round((board.timerEnd - now) / 1000)) : null
  const question = board.question.trim() ? { q: board.question, options: [] as string[], answer: board.answer, from: '' } : null

  return (
    <div className="screen">
      <header className="screen-top">
        <div className="screen-class">
          <span className="brand-mark">⚡</span> {data.cls.name}
        </div>
        <div className="screen-clock" aria-label="Current time">
          {clock}
          <small>{d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</small>
        </div>
        <div className={`screen-timer ${left === 0 ? 'done' : ''}`} aria-live="polite">
          {left === null ? (
            <span className="muted">No timer</span>
          ) : left === 0 ? (
            "⏰ Time's up!"
          ) : (
            <>
              ⏱ {Math.floor(left / 60)}:{two(left % 60)}
              <small>work time left</small>
            </>
          )}
        </div>
        <div className="row screen-controls">
          <button className="small" onClick={() => setEditing(!editing)} aria-pressed={editing}>
            ⚙ {editing ? 'Done' : 'Edit'}
          </button>
          <button className="small" onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}>
            ⛶ Full screen
          </button>
          <Link to={`/class/${data.cls.id}`} className="btn small">
            ✕ Exit
          </Link>
        </div>
      </header>

      {editing && <BoardEditor classId={data.cls.id} board={board} />}

      <div className="screen-grid">
        <section className="screen-col">
          <div className="card screen-goal">
            <div className="screen-label">🎯 Today's mission</div>
            <div className="screen-goal-text">{board.goal.trim() || 'Keep building! Finish your current lesson, then try the Remix.'}</div>
          </div>
          <div className="card screen-q">
            <div className="screen-label">❓ Question of the day</div>
            {question ? (
              <>
                <div className="screen-q-text">{question.q}</div>
                {question.answer && (reveal ? <div className="alert good pop">{question.answer}</div> : null)}
              </>
            ) : (
              <>
                <div className="screen-q-text">{autoQ.q.q}</div>
                <ol className="screen-opts" type="A">
                  {autoQ.q.options.map((o, i) => (
                    <li key={o} className={reveal && i === autoQ.q.answer ? 'right' : ''}>
                      {o}
                    </li>
                  ))}
                </ol>
                {reveal && <div className="alert good pop">💡 {autoQ.q.explain}</div>}
                <div className="small muted">
                  From {autoQ.lesson.icon} {autoQ.lesson.title}
                </div>
              </>
            )}
            {(!question || question.answer) && (
              <button className="small" style={{ marginTop: 10 }} onClick={() => setReveal(!reveal)}>
                {reveal ? 'Hide answer' : 'Reveal answer'}
              </button>
            )}
          </div>
        </section>

        <section className="card screen-race">
          <div className="screen-label">🏁 Race to Launch Day</div>
          <div className="race-stops" aria-hidden="true">
            {STOPS.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <div className="race-rows">
            {companies.map((c) => {
              const p = data.progress.get(c.id)!
              const pos = p.position.startsWith('fork:') ? `🔀 ${BRANCHES[p.position.slice(5)].label}` : getLesson(p.position)?.title
              const pct = Math.min(1, p.completedCount / p.requiredCount)
              return (
                <div key={c.id} className="race-row">
                  <div className="race-name">
                    <LevelBadge level={p.level} size={30} />
                    <div style={{ minWidth: 0 }}>
                      <div className="race-co">{c.name}</div>
                      <div className="race-now">{pos}</div>
                    </div>
                  </div>
                  <div className="race-track">
                    <div className="race-fill" style={{ width: `${pct * 100}%` }} />
                    <div className="race-logo" style={{ left: `${pct * 100}%` }}>
                      <Logo logo={c.logo} size={44} title={c.name} />
                    </div>
                  </div>
                  <div className="race-xp xp-num">⭐ {p.xp}</div>
                </div>
              )
            })}
            {companies.length === 0 && <p className="muted">Companies appear here once students form them.</p>}
          </div>
          {experts.length > 0 && (
            <div className="screen-help">
              <div className="screen-label">🙋 Stuck? Ask an expert</div>
              {experts.map(({ lesson, done }) => (
                <div key={lesson.id} className="help-row">
                  <span className="help-lesson">
                    {lesson.icon} {lesson.title}
                  </span>
                  <span className="row" style={{ gap: 6 }}>
                    {done.slice(0, 4).map((c) => (
                      <span key={c.id} className="chip">
                        <Logo logo={c.logo} size={20} /> {c.name}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card screen-wins">
          <div className="screen-label">🎉 Recent wins</div>
          {wins.length === 0 && <p className="muted">Wins show up here as students pass quizzes and ship builds.</p>}
          {wins.map((w, i) => (
            <div key={i} className="win pop">
              <span className="win-ic">{w.icon}</span>
              {w.company && <Logo logo={w.company.logo} size={30} />}
              <div style={{ minWidth: 0 }}>
                <div className="win-text">{w.text}</div>
                <div className="small muted">{timeAgo(w.at)}</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

function BoardEditor({ classId, board }: { classId: string; board: ClassBoard }) {
  const [goal, setGoal] = useState(board.goal)
  const [question, setQuestion] = useState(board.question)
  const [answer, setAnswer] = useState(board.answer)
  const { busy, error, run } = useAction()
  const save = (patch: Partial<ClassBoard>) => run(() => backend.updateClass(classId, { board: { ...board, goal, question, answer, ...patch } }))
  return (
    <div className="card screen-editor">
      <div className="grid cols-2" style={{ gap: 12 }}>
        <label className="field">
          <span>Today's mission (what students should be working on)</span>
          <textarea rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Finish Loops & Timers. Done early? Do the Remix, then help another company." />
        </label>
        <div>
          <label className="field">
            <span>Question of the day (leave empty to pick one from the lessons)</span>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What's the difference between a Clock and a loop?" />
          </label>
          <label className="field">
            <span>Answer (shown when you tap Reveal)</span>
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </label>
        </div>
      </div>
      <div className="row">
        <button className="go" disabled={busy} onClick={() => save({})}>
          Save
        </button>
        <span className="muted small" style={{ fontWeight: 800 }}>
          Work timer:
        </span>
        {[5, 10, 15, 20, 30].map((m) => (
          <button key={m} className="small" disabled={busy} onClick={() => save({ timerEnd: Date.now() + m * 60_000 })}>
            {m} min
          </button>
        ))}
        <button className="small danger" disabled={busy} onClick={() => save({ timerEnd: null })}>
          Stop
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
