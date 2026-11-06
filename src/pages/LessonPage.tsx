import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { backend } from '../data'
import { useAuth, useClassData } from '../data/hooks'
import type { AiaReport, Company, Lesson, Submission } from '../types'
import { getLesson, TRACK_INFO } from '../curriculum'
import { BRANCHES, nodeById } from '../curriculum/tree'
import { analyzeAia, runChecks } from '../lib/aia'
import { STATUS_LABEL, type LessonProgress } from '../lib/progress'
import { Md } from '../components/Md'
import { Blocks } from '../components/Blocks'
import { AiaReportView } from '../components/AiaReportView'
import { CompanyName, Loading, celebrate, timeAgo, useAction } from '../components/ui'
import { APP_INVENTOR_URL } from '../components/Layout'
import { ask } from '../components/confirm'

type Stage = 'brief' | 'build' | 'quiz' | 'submit'

const EDITOR_TAG: Record<string, { label: string; color: string }> = {
  designer: { label: '🎨 In the Designer', color: 'var(--core)' },
  blocks: { label: '🧩 In the Blocks editor', color: 'var(--blk-event)' },
  phone: { label: '📱 On your phone', color: 'var(--tools)' },
}

function useStepsDone(key: string) {
  const [done, setDone] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '[]')
    } catch {
      return []
    }
  })
  const mark = (i: number) => {
    if (done.includes(i)) return
    const next = [...done, i]
    setDone(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }
  return { done, mark }
}

export function LessonPage() {
  const { classId, lessonId } = useParams()
  const lesson = getLesson(lessonId ?? '')
  if (!lesson) return <div className="page">Lesson not found.</div>
  return <LessonView key={lesson.id} lesson={lesson} classId={classId} />
}

function LessonView({ lesson, classId }: { lesson: Lesson; classId?: string }) {
  const data = useClassData(classId)
  const { user } = useAuth()
  const steps = useStepsDone(`appventure-steps-${user?.uid ?? 'anon'}-${lesson.id}`)
  const company = classId ? data.myCompany : null
  const progress = company ? data.progress.get(company.id)?.lessons[lesson.id] : undefined
  const [stage, setStage] = useState<Stage | null>(null)
  if (classId && data.loading) return <Loading />

  const isTeacher = classId ? data.isTeacher : user?.role === 'teacher'
  const node = nodeById(lesson.id)
  const color = TRACK_INFO[lesson.track].color
  const status = progress?.status
  const branch = node?.branchId ? BRANCHES[node.branchId] : null
  const needsChoice = !!(company && branch && !company.choices[branch.id] && status !== 'locked')
  const canAct = !!company && !!progress && !['locked', 'not-taken'].includes(progress.status) && !needsChoice
  const prereqTitles = node?.prereqs.map((p) => getLesson(p)?.title).filter(Boolean) ?? []
  const totalXp = lesson.xp.quiz + lesson.xp.build

  const current: Stage =
    stage ?? (progress?.quizPassed ? 'submit' : steps.done.length > 0 ? 'build' : 'brief')
  const stageDone: Record<Stage, boolean> = {
    brief: steps.done.length > 0 || !!progress?.quizPassed,
    build: steps.done.length >= lesson.steps.length,
    quiz: !!progress?.quizPassed,
    submit: !!progress?.buildApproved,
  }
  const go = (s: Stage) => {
    setStage(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="page wide">
      <div className="lesson-hero" style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${color} 85%, #fff), ${color} 55%, color-mix(in srgb, ${color} 70%, #000))` }}>
        <div className="row" style={{ flexWrap: 'nowrap', gap: 16 }}>
          <div className="big-icon">{lesson.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="sky-title" style={{ margin: 0 }}>
              {lesson.title}
            </h1>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', opacity: 0.95 }}>{lesson.subtitle}</div>
            <div className="row small" style={{ marginTop: 8, gap: 6 }}>
              <span className="chip">⭐ {totalXp} XP</span>
              <span className="chip">{TRACK_INFO[lesson.track].label}</span>
              {node?.optional && <span className="chip">Side quest</span>}
              {status && <span className="chip">{STATUS_LABEL[status]}</span>}
            </div>
          </div>
        </div>
      </div>

      {company && status === 'locked' && (
        <div className="alert" style={{ marginTop: 18 }}>
          🔒 Locked. Finish {prereqTitles.join(node?.prereqMode === 'any' ? ' or ' : ' and ')} first. You can peek ahead!
        </div>
      )}
      {company && status === 'not-taken' && (
        <div className="alert" style={{ marginTop: 18 }}>
          🛤 Your company picked a different path here. Just looking!
        </div>
      )}
      {needsChoice && branch && company && <ChoosePath classId={classId!} company={company} lesson={lesson} branch={branch} />}
      {!classId && !isTeacher && (
        <div className="alert" style={{ marginTop: 18 }}>
          👀 Preview. <Link to="/">Join a class</Link> to earn XP.
        </div>
      )}

      <StagePath current={current} done={stageDone} onPick={go} />

      <div className="lesson-layout">
        <div className="stack">
          {current === 'brief' && <Brief lesson={lesson} onStart={() => go('build')} />}
          {current === 'build' && (
            <StepPlayer lesson={lesson} done={steps.done} onDone={steps.mark} onFinish={() => go('quiz')} />
          )}
          {current === 'quiz' && (
            <Quiz
              lesson={lesson}
              disabled={!!company && !canAct}
              practice={!company}
              passPercent={data.cls?.settings.quizPassPercent ?? 70}
              best={progress?.quizBest ?? null}
              onNext={() => go('submit')}
              onDone={
                company && canAct
                  ? (score, total) =>
                      backend.recordQuiz(classId!, company.id, lesson.id, { score, total, by: user!.uid, byName: user!.name, at: Date.now() })
                  : undefined
              }
            />
          )}
          {current === 'submit' && (
            <>
              <BonusQuest lesson={lesson} />
              {company && progress ? (
                <SubmitBuild
                  classId={classId!}
                  company={company}
                  lesson={lesson}
                  progress={progress}
                  disabled={!canAct}
                  submissions={(data.submissions ?? []).filter((s) => s.lessonId === lesson.id)}
                />
              ) : (
                <div className="card center muted">Students upload their App Inventor project here.</div>
              )}
            </>
          )}
        </div>

        <aside className="side-sticky stack">
          <a className="btn go big" href={APP_INVENTOR_URL} target="_blank" rel="noreferrer" style={{ width: '100%', justifyContent: 'center' }}>
            🧰 Open App Inventor
          </a>
          {company && progress && <Rewards lesson={lesson} progress={progress} />}
          <p className="center small" style={{ margin: 0 }}>
            <Link to="/phone">📱 Phone won't connect?</Link>
          </p>
          {isTeacher && <TeacherPanel lesson={lesson} />}
          {isTeacher && classId && <CompaniesHere data={data} lessonId={lesson.id} classId={classId} />}
        </aside>
      </div>
    </div>
  )
}

function StagePath({ current, done, onPick }: { current: Stage; done: Record<Stage, boolean>; onPick: (s: Stage) => void }) {
  const stages: { id: Stage; icon: string; label: string }[] = [
    { id: 'brief', icon: '🗺️', label: 'Mission' },
    { id: 'build', icon: '🛠️', label: 'Build' },
    { id: 'quiz', icon: '🧠', label: 'Quiz' },
    { id: 'submit', icon: '🚀', label: 'Ship it' },
  ]
  return (
    <nav className="stages" aria-label="Lesson stages">
      {stages.map((s, i) => (
        <div key={s.id} style={{ display: 'contents' }}>
          {i > 0 && <div className={`stage-line ${done[stages[i - 1].id] ? 'done' : ''}`} />}
          <button className={`stage ${current === s.id ? 'on' : ''} ${done[s.id] ? 'done' : ''}`} onClick={() => onPick(s.id)} aria-current={current === s.id ? 'step' : undefined}>
            <span className="dot">{done[s.id] && current !== s.id ? '✔' : s.icon}</span>
            {s.label}
          </button>
        </div>
      ))}
    </nav>
  )
}

function Brief({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const [flipped, setFlipped] = useState<string[]>([])
  return (
    <>
      <div className="card">
        <div className="small muted" style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Today you build
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: 6 }}>{lesson.project.name}</h2>
        <p className="mission-text">{lesson.project.description}</p>
        <div className="row" style={{ gap: 8, marginBottom: 16 }}>
          {lesson.concepts.map((c) => (
            <span key={c} className="chip brand" style={{ fontSize: '0.9rem' }}>
              🔓 {c}
            </span>
          ))}
        </div>
        <button className="go big" onClick={onStart}>
          Start building ▶
        </button>
      </div>

      {lesson.vocab.length > 0 && (
        <div className="card">
          <h3>🃏 Word cards</h3>
          <p className="small muted">Tap a card to flip it.</p>
          <div className="grid cols-4" style={{ gap: 12 }}>
            {lesson.vocab.map((v) => {
              const on = flipped.includes(v.term)
              return (
                <button
                  key={v.term}
                  className={`flip ${on ? 'flipped' : ''}`}
                  onClick={() => setFlipped(on ? flipped.filter((t) => t !== v.term) : [...flipped, v.term])}
                  aria-label={on ? `${v.term}: ${v.def}` : `${v.term}. Tap to see what it means`}
                >
                  <span className="flip-inner">
                    <span className="flip-face flip-front">
                      <span>
                        {v.term}
                        <small>tap to flip</small>
                      </span>
                    </span>
                    <span className="flip-face flip-back">{v.def}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <details className="card more">
        <summary>📖 Read the full mission story</summary>
        <div style={{ marginTop: 12 }}>
          <Md text={lesson.intro} />
          <h3>You'll be able to…</h3>
          <ul>
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </details>
    </>
  )
}

function StepPlayer({ lesson, done, onDone, onFinish }: { lesson: Lesson; done: number[]; onDone: (i: number) => void; onFinish: () => void }) {
  const firstOpen = lesson.steps.findIndex((_, i) => !done.includes(i))
  const [i, setI] = useState(firstOpen === -1 ? 0 : firstOpen)
  const s = lesson.steps[i]
  const last = i === lesson.steps.length - 1
  return (
    <div className="card">
      <div className="spread" style={{ marginBottom: 14 }}>
        <div className="step-dots" aria-label="Steps">
          {lesson.steps.map((_, k) => (
            <button key={k} className={`${k === i ? 'on' : ''} ${done.includes(k) && k !== i ? 'done' : ''}`} onClick={() => setI(k)} aria-label={`Step ${k + 1}`}>
              {done.includes(k) && k !== i ? '✔' : k + 1}
            </button>
          ))}
        </div>
        <span className="small muted" style={{ fontWeight: 900 }}>
          Step {i + 1} of {lesson.steps.length}
        </span>
      </div>
      <div key={i} className="pop">
        {s.editor && (
          <div className="editor-tag" style={{ color: EDITOR_TAG[s.editor].color }}>
            {EDITOR_TAG[s.editor].label}
          </div>
        )}
        <h2>{s.title}</h2>
        <div className="mission-text">
          <Md text={s.body} />
        </div>
        {s.blocks && <Blocks lines={s.blocks} />}
      </div>
      <div className="spread" style={{ marginTop: 16 }}>
        <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          ◀ Back
        </button>
        <button
          className={last ? 'gold big' : 'go big'}
          onClick={() => {
            onDone(i)
            if (last) onFinish()
            else setI(i + 1)
          }}
        >
          {last ? 'Done! Quiz time 🧠' : 'Got it! Next ▶'}
        </button>
      </div>
    </div>
  )
}

function ChoosePath({ classId, company, lesson, branch }: { classId: string; company: Company; lesson: Lesson; branch: { id: string; label: string; description: string } }) {
  const { busy, run } = useAction()
  return (
    <div className="alert warn" style={{ marginTop: 18 }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: '1.3rem' }}>🔀 {branch.label}: pick one!</div>
      <div className="row" style={{ marginTop: 10 }}>
        <button
          className="gold"
          disabled={busy}
          onClick={() =>
            void ask(`Pick "${lesson.title}" for ${company.name}? Decide with your partner. Only your teacher can undo it.`, 'Pick it!').then((ok) => {
              if (ok) void run(() => backend.chooseBranch(classId, company.id, branch.id, lesson.id))
            })
          }
        >
          ✅ Pick {lesson.title}
        </button>
        <Link to={`/class/${classId}/tree`} className="btn">
          🌳 Compare on the tree
        </Link>
      </div>
    </div>
  )
}

function Quiz({
  lesson,
  disabled,
  practice,
  passPercent,
  best,
  onDone,
  onNext,
}: {
  lesson: Lesson
  disabled: boolean
  practice: boolean
  passPercent: number
  best: number | null
  onDone?: (score: number, total: number) => Promise<void>
  onNext: () => void
}) {
  const shuffle = () => lesson.quiz.map((q) => q.options.map((_, i) => i).sort(() => Math.random() - 0.5))
  const [order, setOrder] = useState(shuffle)
  const [q, setQ] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => lesson.quiz.map(() => null))
  const [finished, setFinished] = useState(false)
  const { busy, error, run } = useAction()
  const total = lesson.quiz.length
  const score = lesson.quiz.reduce((s, qq, i) => s + (answers[i] === qq.answer ? 1 : 0), 0)
  const pct = Math.round((score / total) * 100)
  const passed = pct >= passPercent

  if (disabled)
    return (
      <div className="card center">
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <h2>Quiz locked</h2>
        <p className="muted">It opens when your company reaches this lesson.</p>
      </div>
    )

  const restart = () => {
    setOrder(shuffle())
    setAnswers(lesson.quiz.map(() => null))
    setQ(0)
    setFinished(false)
  }

  if (finished) {
    const stars = pct === 100 ? 3 : passed ? 2 : pct >= 50 ? 1 : 0
    return (
      <div className="card center pop">
        <div className="stars" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((k) => (
            <span key={k} className={k < stars ? '' : 'off'}>
              ⭐
            </span>
          ))}
        </div>
        <h2 style={{ fontSize: '2.2rem' }}>{passed ? (pct === 100 ? 'Perfect!' : 'You passed!') : 'So close!'}</h2>
        <p className="mission-text">
          {score} of {total} right
          {passed && !practice && (
            <>
              {' '}
              · <span className="xp-num">+{lesson.xp.quiz} XP</span>
            </>
          )}
        </p>
        {!passed && <p className="muted">You need {passPercent}% to pass. Try again, the answers get shuffled.</p>}
        <div className="row" style={{ justifyContent: 'center' }}>
          <button onClick={restart}>↺ Try again</button>
          {passed && (
            <button className="gold big" onClick={onNext}>
              Ship your build 🚀
            </button>
          )}
        </div>
      </div>
    )
  }

  const item = lesson.quiz[q]
  const picked = answers[q]
  const answered = picked !== null
  return (
    <div className="card">
      <div className="spread" style={{ marginBottom: 10 }}>
        <div className="step-dots">
          {lesson.quiz.map((qq, k) => (
            <button
              key={k}
              disabled
              className={k === q ? 'on' : answers[k] === null ? '' : answers[k] === qq.answer ? 'done' : ''}
              style={answers[k] !== null && answers[k] !== qq.answer && k !== q ? { background: 'var(--bad)', color: '#fff', opacity: 1, filter: 'none' } : { opacity: 1, filter: 'none' }}
              aria-label={`Question ${k + 1}`}
            >
              {k + 1}
            </button>
          ))}
        </div>
        <span className="small muted" style={{ fontWeight: 900 }}>
          {practice ? 'Practice' : `Pass: ${passPercent}%`}
          {best !== null && ` · best ${best}%`}
        </span>
      </div>
      <div key={q} className="pop">
        <h2 style={{ fontSize: '1.45rem' }}>{item.q}</h2>
        {order[q].map((j, pos) => {
          const cls = answered ? (j === item.answer ? 'right' : picked === j ? 'wrong' : '') : ''
          return (
            <button key={j} className={`quiz-opt ${cls}`} disabled={answered && cls === ''} style={answered && cls === '' ? { opacity: 0.5, filter: 'none' } : undefined} onClick={() => !answered && setAnswers(answers.map((a, k) => (k === q ? j : a)))}>
              <span className="letter">{answered && j === item.answer ? '✔' : answered && picked === j ? '✖' : String.fromCharCode(65 + pos)}</span>
              {item.options[j]}
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={`alert ${picked === item.answer ? 'good' : 'bad'} pop`} style={{ marginTop: 12 }}>
          {picked === item.answer ? '🎉 Nice! ' : '💡 '}
          {item.explain}
        </div>
      )}
      {answered && (
        <div style={{ textAlign: 'right' }}>
          <button
            className="go big"
            disabled={busy}
            onClick={() => {
              if (q < total - 1) setQ(q + 1)
              else
                void run(async () => {
                  await onDone?.(score, total)
                  setFinished(true)
                  if (passed) celebrate()
                })
            }}
          >
            {q < total - 1 ? 'Next ▶' : 'See my score ⭐'}
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  )
}

function BonusQuest({ lesson }: { lesson: Lesson }) {
  return (
    <details className="card more" style={{ background: 'linear-gradient(180deg, #fff9df, #fff1b8)' }}>
      <summary>
        ⭐ Bonus quest: {lesson.challenge.title.replace(/^Bonus:\s*/, '')} <span className="xp-num">+{lesson.xp.bonus} XP</span>
      </summary>
      <div style={{ marginTop: 10 }}>
        <Md text={lesson.challenge.body} />
      </div>
    </details>
  )
}

function Rewards({ lesson, progress }: { lesson: Lesson; progress: LessonProgress }) {
  const row = (ok: boolean, icon: string, label: string, xp: number) => (
    <div className="spread" style={{ padding: '6px 0', fontWeight: 800 }}>
      <span>
        {ok ? '✅' : icon} {label}
      </span>
      <span className={ok ? 'xp-num' : 'muted'}>+{xp}</span>
    </div>
  )
  return (
    <div className="card">
      <h3>🎁 Rewards</h3>
      {row(progress.quizPassed, '🧠', 'Pass the quiz', lesson.xp.quiz)}
      {row(progress.buildApproved, '🚀', 'Build approved', lesson.xp.build)}
      {row(progress.bonusApproved, '⭐', 'Bonus quest', lesson.xp.bonus)}
      <div className="spread" style={{ borderTop: '2px solid var(--line)', marginTop: 6, paddingTop: 8 }}>
        <strong>{STATUS_LABEL[progress.status]}</strong>
        <span className="xp-num">{progress.xp} XP</span>
      </div>
    </div>
  )
}

function SubmitBuild({
  classId,
  company,
  lesson,
  progress,
  submissions,
  disabled,
}: {
  classId: string
  company: Company
  lesson: Lesson
  progress: LessonProgress
  submissions: Submission[]
  disabled: boolean
}) {
  const [report, setReport] = useState<AiaReport | null>(null)
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [bonus, setBonus] = useState(false)
  const [over, setOver] = useState(false)
  const [sent, setSent] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { busy, error, run, setError } = useAction()
  const pending = submissions.some((s) => s.status === 'pending')
  const allEarned = progress.buildApproved && progress.bonusApproved

  const onFile = async (f: File | undefined) => {
    if (!f) return
    setError('')
    try {
      const base = await analyzeAia(f, f.name)
      setReport({ ...base, checks: runChecks(base, lesson.checks) })
    } catch (e) {
      setReport(null)
      setError(e instanceof Error ? e.message : 'Could not read that file.')
    }
  }

  return (
    <div className="card" id="submit">
      <h2>🚀 Ship your build</h2>
      {disabled ? (
        <p className="muted">Opens when your company reaches this lesson.</p>
      ) : allEarned ? (
        <div className="alert good">🏆 Maxed out! You earned every XP in this lesson.</div>
      ) : pending || sent ? (
        <div className="center" style={{ padding: '10px 0' }}>
          <div className="bob" style={{ fontSize: '3rem' }}>
            ⏳
          </div>
          <h3>Sent to your teacher!</h3>
          <p className="muted">You'll get XP when it's approved.</p>
        </div>
      ) : (
        <>
          {progress.buildApproved && <div className="alert good">✅ Approved! Did the bonus quest? Send the new version.</div>}
          <div
            className={`dropzone ${over ? 'over' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => (e.preventDefault(), setOver(true))}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              void onFile(e.dataTransfer.files[0])
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          >
            <span className="ic">📦</span>
            {report ? `${report.fileName} (tap to change)` : 'Drop your .aia file here, or tap to pick it'}
            <input ref={fileRef} type="file" accept=".aia" hidden onChange={(e) => void onFile(e.target.files?.[0])} />
          </div>
          <details className="more small" style={{ marginTop: 8 }}>
            <summary>Where's my .aia file?</summary>
            <p style={{ margin: '6px 0 0' }}>
              In App Inventor: <strong>Projects → Export selected project (.aia) to my computer</strong>. It lands in your Downloads folder.
            </p>
          </details>
          {report && (
            <div className="card soft pop" style={{ marginTop: 12 }}>
              <AiaReportView report={report} compact />
              {report.checks.some((c) => !c.passed) && <p className="small" style={{ margin: '8px 0 0' }}>⚠️ Fix the ❌ items, export again, and re-upload.</p>}
            </div>
          )}
          <label className="row" style={{ gap: 8, margin: '14px 0', fontWeight: 800 }}>
            <input type="checkbox" checked={bonus} onChange={(e) => setBonus(e.target.checked)} style={{ width: 22, height: 22 }} />
            ⭐ We did the bonus quest
          </label>
          <details className="more small" style={{ marginBottom: 14 }}>
            <summary>Add a link or a note (optional)</summary>
            <label className="field" style={{ marginTop: 8 }}>
              <span>Link: Gallery, Drive or a video</span>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" type="url" />
            </label>
            <label className="field">
              <span>Note for your teacher</span>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you add?" />
            </label>
          </details>
          <button
            className="gold big"
            disabled={busy || (!report && !link.trim()) || (progress.buildApproved && !bonus)}
            onClick={async () => {
              const ok = await run(() =>
                backend.submit(classId, company, { lessonId: lesson.id, link: link.trim(), notes: notes.trim(), claimsBonus: bonus, aia: report }),
              )
              if (ok) {
                setSent(true)
                celebrate()
              }
            }}
          >
            Send to teacher 🚀
          </button>
          {error && <p className="error">{error}</p>}
        </>
      )}

      {submissions.some((s) => s.feedback) && (
        <div style={{ marginTop: 18 }}>
          <h3>💬 Teacher says</h3>
          {submissions
            .filter((s) => s.feedback)
            .slice(0, 3)
            .map((s) => (
              <div key={s.id} className={`alert ${s.status === 'approved' ? 'good' : 'bad'}`} style={{ marginBottom: 10 }}>
                <div className="small muted">
                  {s.status === 'approved' ? '✅ Approved' : '✏️ Fix this'} · {timeAgo(s.reviewedAt ?? s.submittedAt)}
                </div>
                {s.feedback}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

function TeacherPanel({ lesson }: { lesson: Lesson }) {
  return (
    <details className="card more" style={{ background: 'var(--warn-soft)' }}>
      <summary>👩‍🏫 Teacher notes</summary>
      <p className="small" style={{ marginTop: 8 }}>
        {lesson.teacherNotes}
      </p>
      <p className="small" style={{ margin: '0 0 4px', fontWeight: 900 }}>
        Auto-checks on the .aia
      </p>
      <ul className="small" style={{ paddingLeft: '1.2em', margin: 0 }}>
        {lesson.checks.map((c) => (
          <li key={c.label}>{c.label}</li>
        ))}
      </ul>
      <p className="small muted" style={{ margin: '8px 0 0' }}>
        ⏱ About {lesson.periods} class period{lesson.periods > 1 ? 's' : ''}
      </p>
    </details>
  )
}

function CompaniesHere({ data, lessonId, classId }: { data: ReturnType<typeof useClassData>; lessonId: string; classId: string }) {
  const nav = useNavigate()
  const rows = (data.companies ?? [])
    .map((c) => ({ c, st: data.progress.get(c.id)?.lessons[lessonId]?.status }))
    .filter((r) => r.st && r.st !== 'locked' && r.st !== 'not-taken')
  return (
    <div className="card">
      <h3>🏢 Companies here</h3>
      {rows.length === 0 && <p className="small muted">Nobody has reached this lesson yet.</p>}
      {rows.map(({ c, st }) => (
        <div key={c.id} className="spread" style={{ marginBottom: 8 }}>
          <CompanyName company={c} size={26} />
          <span
            className={`chip ${st === 'complete' ? 'good' : st === 'review' ? 'warn' : st === 'returned' ? 'bad' : ''}`}
            style={{ cursor: st === 'review' ? 'pointer' : undefined }}
            onClick={() => st === 'review' && nav(`/class/${classId}`)}
          >
            {STATUS_LABEL[st!]}
          </span>
        </div>
      ))}
    </div>
  )
}
