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
import { CompanyName, Loading, timeAgo, useAction } from '../components/ui'
import { APP_INVENTOR_URL } from '../components/Layout'

const EDITOR_TAG: Record<string, { label: string; color: string }> = {
  designer: { label: '🎨 Designer', color: 'var(--core)' },
  blocks: { label: '🧩 Blocks editor', color: 'var(--blk-event)' },
  phone: { label: '📱 On your phone', color: 'var(--tools)' },
}

export function LessonPage() {
  const { classId, lessonId } = useParams()
  const lesson = getLesson(lessonId ?? '')
  const data = useClassData(classId)
  const { user } = useAuth()
  if (!lesson) return <div className="page">Lesson not found.</div>
  if (classId && data.loading) return <Loading />

  const company = classId ? data.myCompany : null
  const progress = company ? data.progress.get(company.id)?.lessons[lesson.id] : undefined
  const isTeacher = classId ? data.isTeacher : user?.role === 'teacher'
  const node = nodeById(lesson.id)
  const color = TRACK_INFO[lesson.track].color
  const status = progress?.status
  const branch = node?.branchId ? BRANCHES[node.branchId] : null
  const needsChoice = !!(company && branch && !company.choices[branch.id] && status !== 'locked')
  const canAct = !!company && !!progress && !['locked', 'not-taken'].includes(progress.status) && !needsChoice
  const prereqTitles = node?.prereqs.map((p) => getLesson(p)?.title).filter(Boolean) ?? []

  return (
    <div className="page wide">
      <div className="lesson-hero" style={{ background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #000))`, marginBottom: 20 }}>
        <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <div className="big-icon">{lesson.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="row small" style={{ marginBottom: 6 }}>
              <span className="chip">{TRACK_INFO[lesson.track].label}</span>
              <span className="chip">⏱ {lesson.periods} class period{lesson.periods > 1 ? 's' : ''}</span>
              {node?.optional && <span className="chip">Optional</span>}
              {status && <span className="chip">{STATUS_LABEL[status]}</span>}
            </div>
            <h1 style={{ margin: 0, color: '#fff' }}>{lesson.title}</h1>
            <div style={{ opacity: 0.9, fontSize: '1.05rem' }}>{lesson.subtitle}</div>
            <div className="row small" style={{ marginTop: 10, gap: 6 }}>
              {lesson.concepts.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {company && status === 'locked' && (
        <div className="alert">🔒 This lesson unlocks after you complete {prereqTitles.join(node?.prereqMode === 'any' ? ' or ' : ' and ')}. You can read ahead!</div>
      )}
      {company && status === 'not-taken' && <div className="alert">🛤 Your company chose a different path here. You can still read this lesson for fun.</div>}
      {needsChoice && branch && company && <ChoosePath classId={classId!} company={company} lesson={lesson} branch={branch} />}
      {!classId && !isTeacher && (
        <div className="alert">
          👀 Preview mode. <Link to="/">Sign in and join a class</Link> to take the quiz for XP and submit your build.
        </div>
      )}

      <div className="lesson-layout">
        <div className="stack">
          <div className="card">
            <h2>🛠 Project: {lesson.project.name}</h2>
            <p>{lesson.project.description}</p>
            <Md text={lesson.intro} />
          </div>

          <Steps key={lesson.id} lesson={lesson} storageKey={`appventure-steps-${user?.uid ?? 'anon'}-${lesson.id}`} />

          <div className="card" style={{ borderLeft: '5px solid var(--xp)' }}>
            <h3>⭐ {lesson.challenge.title}</h3>
            <Md text={lesson.challenge.body} />
            <p className="small muted" style={{ margin: 0 }}>
              Worth +{lesson.xp.bonus} bonus XP. Tick "we did the bonus challenge" when you submit.
            </p>
          </div>

          <Quiz
            key={lesson.id}
            lesson={lesson}
            disabled={!!company && !canAct}
            practice={!company}
            passPercent={data.cls?.settings.quizPassPercent ?? 70}
            best={progress?.quizBest ?? null}
            onDone={
              company && canAct
                ? (score, total) =>
                    backend.recordQuiz(classId!, company.id, lesson.id, { score, total, by: user!.uid, byName: user!.name, at: Date.now() })
                : undefined
            }
          />

          {company && progress && (
            <SubmitBuild key={lesson.id} classId={classId!} company={company} lesson={lesson} progress={progress} disabled={!canAct} submissions={(data.submissions ?? []).filter((s) => s.lessonId === lesson.id)} />
          )}
        </div>

        <aside className="side-sticky stack">
          {company && progress && <StatusCard lesson={lesson} progress={progress} />}
          <div className="card">
            <h3>🧰 Build it</h3>
            <p className="small">Keep this lesson open and build in App Inventor in another tab. Your phone shows changes live through the AI Companion.</p>
            <a className="btn btn-primary" href={APP_INVENTOR_URL} target="_blank" rel="noreferrer" style={{ width: '100%', justifyContent: 'center' }}>
              Open App Inventor ↗
            </a>
            <p className="small" style={{ marginTop: 8, marginBottom: 0 }}>
              <Link to="/phone">📱 Phone connection help</Link>
            </p>
          </div>
          <div className="card">
            <h3>🎯 You will be able to…</h3>
            <ul className="small" style={{ paddingLeft: '1.2em', margin: 0 }}>
              {lesson.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          {lesson.vocab.length > 0 && (
            <div className="card">
              <h3>📖 Vocabulary</h3>
              {lesson.vocab.map((v) => (
                <p key={v.term} className="small">
                  <strong>{v.term}:</strong> {v.def}
                </p>
              ))}
            </div>
          )}
          {isTeacher && (
            <div className="card" style={{ background: 'var(--warn-soft)' }}>
              <h3>👩‍🏫 Teacher notes</h3>
              <p className="small" style={{ margin: 0 }}>
                {lesson.teacherNotes}
              </p>
              <h4 style={{ marginTop: 12 }} className="small">
                Auto-checks on the .aia
              </h4>
              <ul className="small" style={{ paddingLeft: '1.2em', margin: 0 }}>
                {lesson.checks.map((c) => (
                  <li key={c.label}>{c.label}</li>
                ))}
              </ul>
            </div>
          )}
          {isTeacher && classId && <CompaniesHere data={data} lessonId={lesson.id} classId={classId} />}
        </aside>
      </div>
    </div>
  )
}

function ChoosePath({ classId, company, lesson, branch }: { classId: string; company: Company; lesson: Lesson; branch: { id: string; label: string; description: string } }) {
  const { busy, run } = useAction()
  return (
    <div className="alert warn">
      <strong>🔀 {branch.label}.</strong> {branch.description}
      <div className="row" style={{ marginTop: 10 }}>
        <button
          className="primary"
          disabled={busy}
          onClick={() =>
            confirm(`Choose "${lesson.title}" for ${company.name}? Talk with your partner first. Only your teacher can undo this.`) &&
            run(() => backend.chooseBranch(classId, company.id, branch.id, lesson.id))
          }
        >
          ✅ Choose {lesson.title}
        </button>
        <Link to={`/class/${classId}/tree`} className="btn">
          Compare the options on the tree
        </Link>
      </div>
    </div>
  )
}

function Steps({ lesson, storageKey }: { lesson: Lesson; storageKey: string }) {
  const [done, setDone] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    } catch {
      return []
    }
  })
  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((d) => d !== i) : [...done, i]
    setDone(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }
  return (
    <div className="card">
      <div className="spread">
        <h2>🪜 Steps</h2>
        <span className="small muted">
          {done.length}/{lesson.steps.length} done
        </span>
      </div>
      <div className="stack">
        {lesson.steps.map((s, i) => (
          <div key={i} className={`step ${done.includes(i) ? 'done' : ''}`}>
            <button className="step-num" onClick={() => toggle(i)} aria-label={`Mark step ${i + 1} ${done.includes(i) ? 'not done' : 'done'}`} style={{ padding: 0, border: 'none' }}>
              {done.includes(i) ? '✓' : i + 1}
            </button>
            <div>
              <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                <h3 style={{ margin: 0 }}>{s.title}</h3>
                {s.editor && (
                  <span className="editor-tag" style={{ color: EDITOR_TAG[s.editor].color }}>
                    {EDITOR_TAG[s.editor].label}
                  </span>
                )}
              </div>
              <Md text={s.body} />
              {s.blocks && <Blocks lines={s.blocks} />}
            </div>
          </div>
        ))}
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
}: {
  lesson: Lesson
  disabled: boolean
  practice: boolean
  passPercent: number
  best: number | null
  onDone?: (score: number, total: number) => Promise<void>
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => lesson.quiz.map(() => null))
  const [checked, setChecked] = useState(false)
  // Shuffle answer order on every attempt so position doesn't give the answer away.
  const shuffle = () => lesson.quiz.map((q) => q.options.map((_, i) => i).sort(() => Math.random() - 0.5))
  const [order, setOrder] = useState(shuffle)
  const { busy, error, run } = useAction()
  const score = lesson.quiz.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0)
  const pct = Math.round((score / lesson.quiz.length) * 100)
  return (
    <div className="card">
      <div className="spread">
        <h2>🧠 Concept check</h2>
        <span className="small muted">
          {practice ? 'Practice mode' : `Pass with ${passPercent}% for +${lesson.xp.quiz} XP`}
          {best !== null && ` · best: ${best}%`}
        </span>
      </div>
      {disabled && <p className="muted small">The quiz unlocks when this lesson is available to your company.</p>}
      {lesson.quiz.map((q, i) => (
        <div key={i} className="quiz-q">
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {i + 1}. {q.q}
          </div>
          {order[i].map((j, pos) => {
            const o = q.options[j]
            const picked = answers[i] === j
            const cls = checked ? (j === q.answer ? 'right' : picked ? 'wrong' : '') : picked ? 'picked' : ''
            return (
              <button
                key={j}
                className={`quiz-opt ${cls}`}
                disabled={disabled || checked}
                onClick={() => setAnswers(answers.map((a, k) => (k === i ? j : a)))}
              >
                <span className="muted">{String.fromCharCode(65 + pos)}.</span> {o}
              </button>
            )
          })}
          {checked && <div className={`small ${answers[i] === q.answer ? '' : 'error'}`}>💡 {q.explain}</div>}
        </div>
      ))}
      {!checked ? (
        <button
          className="primary"
          disabled={disabled || busy || answers.some((a) => a === null)}
          onClick={() =>
            run(async () => {
              await onDone?.(score, lesson.quiz.length)
              setChecked(true)
            })
          }
        >
          Check my answers
        </button>
      ) : (
        <div className={`alert ${pct >= passPercent ? 'good' : 'bad'}`} style={{ margin: 0 }}>
          <strong>
            {score}/{lesson.quiz.length} ({pct}%)
          </strong>{' '}
          {pct >= passPercent ? (practice ? 'You would pass! 🎉' : `Passed! +${lesson.xp.quiz} XP for your company 🎉`) : `You need ${passPercent}% to pass. Read the explanations and try again.`}{' '}
          <button
            className="small"
            onClick={() => {
              setAnswers(lesson.quiz.map(() => null))
              setOrder(shuffle())
              setChecked(false)
            }}
          >
            Retake
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  )
}

function StatusCard({ lesson, progress }: { lesson: Lesson; progress: LessonProgress }) {
  const row = (ok: boolean, label: string, xp: number) => (
    <div className="spread small" style={{ padding: '4px 0' }}>
      <span>
        {ok ? '✅' : '⬜'} {label}
      </span>
      <span className={ok ? 'xp-num' : 'muted'}>+{xp} XP</span>
    </div>
  )
  return (
    <div className="card">
      <h3>📊 Progress</h3>
      {row(progress.quizPassed, 'Pass the concept check', lesson.xp.quiz)}
      {row(progress.buildApproved, 'Build approved by teacher', lesson.xp.build)}
      {row(progress.bonusApproved, 'Bonus challenge', lesson.xp.bonus)}
      <div className="spread" style={{ borderTop: '1px solid var(--line)', marginTop: 6, paddingTop: 8 }}>
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
      <h2>📤 Submit your build</h2>
      {disabled ? (
        <p className="muted">Submissions open when this lesson is available to your company.</p>
      ) : allEarned ? (
        <div className="alert good">🏆 Build and bonus approved. You earned every XP point in this lesson!</div>
      ) : pending ? (
        <div className="alert warn">⏳ Your build is waiting for your teacher's review. You'll get XP when it's approved.</div>
      ) : (
        <>
          {progress.buildApproved && (
            <div className="alert good">
              ✅ Your build is approved!{' '}
              {!progress.bonusApproved && 'Did the bonus challenge afterwards? Submit an updated version below to claim bonus XP.'}
            </div>
          )}
          <p className="small">
            In App Inventor: <strong>Projects → Export selected project (.aia) to my computer</strong>, then drop the file here. We check it right here in
            your browser.
          </p>
          <div
            className={`dropzone ${over ? 'over' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => (e.preventDefault(), setOver(true))}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setOver(false)
              onFile(e.dataTransfer.files[0])
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          >
            {report ? `📦 ${report.fileName}. Click to choose a different file.` : '📦 Drop your .aia file here, or click to choose it'}
            <input ref={fileRef} type="file" accept=".aia" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          {report && (
            <div style={{ marginTop: 12 }}>
              <AiaReportView report={report} />
              {report.checks.some((c) => !c.passed) && (
                <p className="small" style={{ marginTop: 6 }}>
                  ⚠️ Some checks didn't pass. You can still submit, but your teacher will probably ask for changes. Fix it in App Inventor, export
                  again, and re-upload.
                </p>
              )}
            </div>
          )}
          <label className="field" style={{ marginTop: 12 }}>
            <span>Link (optional): an App Inventor Gallery link, Google Drive link or video of your app working</span>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" type="url" />
          </label>
          <label className="field">
            <span>Notes for your teacher (optional)</span>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you add? What was tricky?" />
          </label>
          <label className="row small" style={{ gap: 6, marginBottom: 12 }}>
            <input type="checkbox" checked={bonus} onChange={(e) => setBonus(e.target.checked)} style={{ width: 'auto' }} />
            ⭐ We did the bonus challenge ({lesson.challenge.title.replace(/^Bonus:\s*/, '')})
          </label>
          <button
            className="primary"
            disabled={busy || (!report && !link.trim()) || (progress.buildApproved && !bonus)}
            onClick={async () => {
              const ok = await run(() =>
                backend.submit(classId, company, { lessonId: lesson.id, link: link.trim(), notes: notes.trim(), claimsBonus: bonus, aia: report }),
              )
              if (ok) {
                setReport(null)
                setLink('')
                setNotes('')
                setBonus(false)
                setSent(true)
              }
            }}
          >
            Submit for review
          </button>
          {sent && <span className="small muted"> Sent ✓</span>}
          {error && <p className="error">{error}</p>}
        </>
      )}

      {submissions.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>History</h3>
          {submissions.map((s) => (
            <div key={s.id} className="card flat" style={{ padding: 12, marginBottom: 8 }}>
              <div className="row small">
                <span className={`chip ${s.status === 'approved' ? 'good' : s.status === 'returned' ? 'bad' : 'warn'}`}>
                  {s.status === 'approved' ? 'Approved' : s.status === 'returned' ? 'Needs changes' : 'Waiting for review'}
                </span>
                <span className="muted">
                  by {s.submittedByName} · {timeAgo(s.submittedAt)}
                </span>
                {s.bonusApproved && <span className="chip good">⭐ bonus</span>}
              </div>
              {s.feedback && (
                <p style={{ margin: '8px 0 0' }}>
                  💬 <strong>Teacher:</strong> {s.feedback}
                </p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function CompaniesHere({ data, lessonId, classId }: { data: ReturnType<typeof useClassData>; lessonId: string; classId: string }) {
  const nav = useNavigate()
  const rows = (data.companies ?? [])
    .map((c) => ({ c, st: data.progress.get(c.id)?.lessons[lessonId]?.status }))
    .filter((r) => r.st && r.st !== 'locked' && r.st !== 'not-taken')
  return (
    <div className="card">
      <h3>🏢 Companies on this lesson</h3>
      {rows.length === 0 && <p className="small muted">No company has reached this lesson yet.</p>}
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
