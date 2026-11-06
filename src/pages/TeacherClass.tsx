import { ask } from '../components/confirm'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backend } from '../data'
import type { useClassData } from '../data/hooks'
import { getLesson } from '../curriculum'
import { BRANCHES } from '../curriculum/tree'
import { Tree, TreeLegend } from '../components/Tree'
import { CompanyName, useAction } from '../components/ui'
import { ReviewQueue } from './ReviewQueue'

type Data = ReturnType<typeof useClassData>
type Tab = 'overview' | 'review' | 'companies' | 'students' | 'settings'

export function TeacherClass({ data }: { data: Data }) {
  const { cls, companies, members, submissions, progress } = data
  const c = cls!
  const [tab, setTab] = useState<Tab>('overview')
  const nav = useNavigate()
  const pending =
    (submissions ?? []).filter((s) => s.status === 'pending').length +
    (companies ?? []).reduce((n, c) => n + Object.values(c.plans ?? {}).filter((p) => !p.approved).length, 0)
  const noCompany = (members ?? []).filter((m) => !m.companyId)
  const joinUrl = `${location.origin}${location.pathname}`

  return (
    <div className="page wide">
      <div className="spread">
        <div>
          <h1 style={{ marginBottom: 0 }}>{c.name}</h1>
          <div className="muted small">
            {members?.length ?? 0} students · {companies?.length ?? 0} companies
          </div>
        </div>
        <div className="card flat" style={{ padding: '10px 16px' }}>
          <div className="small muted">Students join at {joinUrl.replace(/^https?:\/\//, '')} with code</div>
          <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.6rem', letterSpacing: '0.2em', fontWeight: 700 }}>{c.joinCode}</div>
        </div>
      </div>

      <div className="tabs" style={{ marginTop: 16 }}>
        {(
          [
            ['overview', '🌳 Overview'],
            ['review', '📥 Review'],
            ['companies', '🏢 Companies'],
            ['students', '🧑‍🎓 Students'],
            ['settings', '⚙️ Settings'],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {label}
            {t === 'review' && pending > 0 && <span className="badge-count">{pending}</span>}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {pending > 0 && (
            <div className="alert warn">
              📥 {pending} item{pending > 1 ? 's are' : ' is'} waiting for review.{' '}
              <button className="small" onClick={() => setTab('review')}>
                Review now
              </button>
            </div>
          )}
          {noCompany.length > 0 && (
            <div className="alert">
              👀 Not in a company yet: {noCompany.map((m) => m.name).join(', ')}
            </div>
          )}
          <p className="muted small">
            Every company's logo sits on the lesson they're working on. Green numbers show how many companies finished each lesson.
            Click a lesson to preview it.
          </p>
          <TreeLegend />
          <Tree companies={companies ?? []} progress={progress} showCounts onSelect={(id) => nav(`/class/${c.id}/lesson/${id}`)} />
        </>
      )}

      {tab === 'review' && <ReviewQueue classId={c.id} submissions={submissions ?? []} companies={companies ?? []} />}

      {tab === 'companies' && (
        <div className="card table-wrap">
          <table className="list">
            <thead>
              <tr>
                <th>Company</th>
                <th>Members</th>
                <th>Level</th>
                <th>XP</th>
                <th>Done</th>
                <th>Working on</th>
                <th>Path choices</th>
              </tr>
            </thead>
            <tbody>
              {(companies ?? []).map((co) => {
                const p = progress.get(co.id)!
                const pos = p.position.startsWith('fork:') ? `🔀 ${BRANCHES[p.position.slice(5)].label}` : getLesson(p.position)?.title
                return (
                  <tr key={co.id}>
                    <td>
                      <CompanyName company={co} sub={co.tagline} />
                    </td>
                    <td className="small">{Object.values(co.memberNames).join(', ')}</td>
                    <td className="small">
                      {p.level.icon} {p.level.name}
                    </td>
                    <td className="xp-num">{p.xp}</td>
                    <td>
                      {p.completedCount}/{p.requiredCount}
                    </td>
                    <td className="small">{pos}</td>
                    <td className="small">
                      {Object.keys(co.choices).length === 0 && <span className="muted">none yet</span>}
                      {Object.entries(co.choices).map(([b, l]) => (
                        <ResetChoice key={b} classId={c.id} companyId={co.id} branchId={b} lessonId={l} />
                      ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {companies?.length === 0 && <p className="muted center">No companies yet. Students create them after joining.</p>}
        </div>
      )}

      {tab === 'students' && (
        <div className="card table-wrap">
          <table className="list">
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Quizzes taken</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(members ?? []).map((m) => {
                const co = companies?.find((x) => x.id === m.companyId)
                const quizzes = co ? Object.values(co.quizzes).filter((byUser) => byUser[m.uid] && !byUser[m.uid].excused).length : 0
                return (
                  <tr key={m.uid}>
                    <td>
                      {m.name}
                      {m.email && <div className="small muted">{m.email}</div>}
                    </td>
                    <td>{co ? <CompanyName company={co} size={24} /> : <span className="muted">none</span>}</td>
                    <td>{quizzes}</td>
                    <td style={{ textAlign: 'right' }}>
                      {co && (
                        <button className="small" onClick={() => void ask(`Remove ${m.name} from ${co.name}?`).then((ok) => { if (ok) void backend.leaveCompany(c.id, co.id, m.uid) })}>
                          Remove from company
                        </button>
                      )}{' '}
                      <button className="small danger" onClick={() => void ask(`Remove ${m.name} from the class?`).then((ok) => { if (ok) void backend.removeMember(c.id, m.uid) })}>
                        Remove from class
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {members?.length === 0 && <p className="muted center">No students yet. Share the join code {c.joinCode}.</p>}
        </div>
      )}

      {tab === 'settings' && <Settings data={data} />}
    </div>
  )
}

function ResetChoice({ classId, companyId, branchId, lessonId }: { classId: string; companyId: string; branchId: string; lessonId: string }) {
  return (
    <div className="row" style={{ gap: 4 }}>
      <span>{getLesson(lessonId)?.title}</span>
      <button
        className="small ghost"
        title="Let this company choose again"
        onClick={() => void ask('Reset this choice so the company can pick a different path?').then((ok) => { if (ok) void backend.chooseBranch(classId, companyId, branchId, null) })}
      >
        ↺
      </button>
    </div>
  )
}

function Settings({ data }: { data: Data }) {
  const c = data.cls!
  const [name, setName] = useState(c.name)
  const [size, setSize] = useState(c.settings.maxCompanySize)
  const [pass, setPass] = useState(c.settings.quizPassPercent)
  const { busy, error, run } = useAction()
  const [saved, setSaved] = useState(false)
  const nav = useNavigate()
  return (
    <div className="grid cols-2">
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault()
          const ok = await run(() => backend.updateClass(c.id, { name, settings: { maxCompanySize: size, quizPassPercent: pass } }))
          if (ok) setSaved(true)
        }}
      >
        <h3>Class settings</h3>
        <label className="field">
          <span>Class name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span>Max people per company</span>
          <input type="number" min={1} max={6} value={size} onChange={(e) => setSize(+e.target.value)} />
        </label>
        <label className="field">
          <span>Quiz passing score (%)</span>
          <input type="number" min={0} max={100} step={5} value={pass} onChange={(e) => setPass(+e.target.value)} />
        </label>
        <button className="primary" disabled={busy}>
          Save
        </button>
        {saved && <span className="small muted"> Saved ✓</span>}
        {error && <p className="error">{error}</p>}
      </form>
      <div className="card">
        <h3>How XP works</h3>
        <ul className="small">
          <li>Each lesson has a quiz (auto-graded) and a build (you review it).</li>
          <li>A lesson is complete when the quiz is passed AND the build is approved.</li>
          <li>Approving a build awards its build XP. Tick "bonus" to award challenge XP too.</li>
          <li>The .aia checker helps you review but never approves anything on its own.</li>
        </ul>
        <p className="small">
          <Link to="/lessons">Browse all lessons and teacher notes →</Link>
        </p>
        <h3 style={{ marginTop: 20 }}>Danger zone</h3>
        <button
          className="danger"
          onClick={async () => {
            if (await ask(`Delete "${c.name}"? Students will lose access to it.`, 'Delete class')) {
              await backend.deleteClass(c.id)
              nav('/teacher')
            }
          }}
        >
          Delete class
        </button>
      </div>
    </div>
  )
}
