import { useState } from 'react'
import { Link } from 'react-router-dom'
import { backend } from '../data'
import type { CapstonePlan, Company, Submission } from '../types'
import { getLesson } from '../curriculum'
import { AiaReportView } from '../components/AiaReportView'
import { CompanyName, timeAgo, useAction } from '../components/ui'

export function ReviewQueue({ classId, submissions, companies }: { classId: string; submissions: Submission[]; companies: Company[] }) {
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')
  const list = submissions.filter((s) => filter === 'all' || s.status === 'pending')
  const plans = companies.flatMap((c) => Object.entries(c.plans ?? {}).filter(([, p]) => !p.approved).map(([lessonId, plan]) => ({ c, lessonId, plan })))
  return (
    <div>
      {plans.length > 0 && (
        <div className="stack" style={{ marginBottom: 24 }}>
          <h2>📝 Capstone plans to approve</h2>
          {plans.map(({ c, lessonId, plan }) => (
            <PlanCard key={c.id + lessonId} classId={classId} company={c} lessonId={lessonId} plan={plan} />
          ))}
        </div>
      )}
      <div className="spread" style={{ marginBottom: 12 }}>
        <div className="row">
          <button className={`small ${filter === 'pending' ? 'primary' : ''}`} onClick={() => setFilter('pending')}>
            Waiting ({submissions.filter((s) => s.status === 'pending').length})
          </button>
          <button className={`small ${filter === 'all' ? 'primary' : ''}`} onClick={() => setFilter('all')}>
            All submissions
          </button>
        </div>
        <span className="small muted">Approving a build awards its XP. Returning it asks for changes.</span>
      </div>
      {list.length === 0 && <div className="card flat center muted">🎉 Nothing waiting for review.</div>}
      <div className="stack">
        {list.map((s) => (
          <ReviewCard key={s.id} classId={classId} sub={s} company={companies.find((c) => c.id === s.companyId)} />
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ classId, sub, company }: { classId: string; sub: Submission; company?: Company }) {
  const lesson = getLesson(sub.lessonId)
  const [feedback, setFeedback] = useState(sub.feedback)
  const [bonus, setBonus] = useState(sub.bonusApproved || sub.claimsBonus)
  const { busy, error, run } = useAction()
  const review = (status: 'approved' | 'returned') =>
    run(() => backend.review(classId, sub.id, { status, feedback: feedback.trim(), bonusApproved: status === 'approved' && bonus }))
  return (
    <div className="card">
      <div className="spread" style={{ marginBottom: 10 }}>
        {company ? <CompanyName company={company} size={40} sub={`by ${sub.submittedByName} · ${timeAgo(sub.submittedAt)}`} /> : <strong>{sub.companyName}</strong>}
        <div className="row">
          <Link to={`/class/${classId}/lesson/${sub.lessonId}`} className="chip brand" style={{ textDecoration: 'none' }}>
            {lesson?.icon} {lesson?.title}
          </Link>
          {lesson?.individual && <span className="chip">🧗 Solo: {sub.submittedByName}</span>}
          <span className={`chip ${sub.status === 'approved' ? 'good' : sub.status === 'returned' ? 'bad' : 'warn'}`}>{sub.status}</span>
        </div>
      </div>
      <div className="grid cols-2">
        <div>
          {sub.aia ? <AiaReportView report={sub.aia} /> : <p className="muted small">No .aia file uploaded.</p>}
          {sub.link && (
            <p className="small">
              🔗 <a href={sub.link} target="_blank" rel="noreferrer">{sub.link}</a>
            </p>
          )}
          {sub.contributions && (
            <div className="small" style={{ margin: '8px 0' }}>
              <strong>🤝 Who did what</strong>
              {Object.entries(sub.contributions).map(([uid, text]) => (
                <div key={uid}>
                  <strong>{company?.memberNames[uid] ?? 'Member'}:</strong> {text}
                </div>
              ))}
            </div>
          )}
          {sub.notes && (
            <p className="small">
              <strong>Student notes:</strong> {sub.notes}
            </p>
          )}
          {sub.claimsBonus && lesson && (
            <p className="small">
              ⭐ <strong>Claims the bonus challenge</strong> ({lesson.challenge.title}, +{lesson.xp.bonus} XP)
            </p>
          )}
        </div>
        <div>
          <label className="field">
            <span>Feedback for the company</span>
            <textarea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What worked well? What should they fix?" />
          </label>
          {lesson && (
            <label className="row small" style={{ marginBottom: 10, gap: 6 }}>
              <input type="checkbox" checked={bonus} onChange={(e) => setBonus(e.target.checked)} style={{ width: 'auto' }} />
              Award bonus challenge XP (+{lesson.xp.bonus})
            </label>
          )}
          <div className="row">
            <button className="good" disabled={busy} onClick={() => review('approved')}>
              ✓ Approve (+{(lesson?.xp.build ?? 0) + (bonus ? (lesson?.xp.bonus ?? 0) : 0)} XP)
            </button>
            <button className="danger" disabled={busy || !feedback.trim()} onClick={() => review('returned')} title={feedback.trim() ? '' : 'Write feedback first'}>
              ↩ Return for changes
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  )
}

function PlanCard({ classId, company, lessonId, plan }: { classId: string; company: Company; lessonId: string; plan: CapstonePlan }) {
  const [feedback, setFeedback] = useState(plan.feedback)
  const { busy, error, run } = useAction()
  const lesson = getLesson(lessonId)
  const save = (approved: boolean) => run(() => backend.savePlan(classId, company.id, lessonId, { ...plan, approved, feedback: feedback.trim() }))
  return (
    <div className="card">
      <div className="spread" style={{ marginBottom: 8 }}>
        <CompanyName company={company} size={36} sub={`${lesson?.title} · updated ${timeAgo(plan.updatedAt)}`} />
      </div>
      <div className="grid cols-2">
        <div className="small">
          <p style={{ margin: '0 0 6px' }}>
            <strong>Idea:</strong> {plan.idea}
          </p>
          <p style={{ margin: '0 0 6px' }}>
            <strong>Pitch:</strong> {plan.pitch || '—'}
          </p>
          <strong>MUST</strong>
          <ul style={{ margin: '2px 0 6px', paddingLeft: '1.2em' }}>
            {plan.must.filter(Boolean).map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          {plan.nice.some(Boolean) && (
            <>
              <strong>NICE</strong>
              <ul style={{ margin: '2px 0 6px', paddingLeft: '1.2em' }}>
                {plan.nice.filter(Boolean).map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </>
          )}
          <strong>Roles</strong>
          {Object.entries(plan.roles).map(([uid, r]) => (
            <div key={uid}>
              {company.memberNames[uid] ?? 'Member'}: {r || '—'}
            </div>
          ))}
        </div>
        <div>
          <label className="field">
            <span>Feedback (scope, ideas)</span>
            <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Is it doable in the time? What should they cut or add?" />
          </label>
          <div className="row">
            <button className="good" disabled={busy} onClick={() => save(true)}>
              ✓ Approve plan
            </button>
            <button disabled={busy || !feedback.trim()} onClick={() => save(false)}>
              Send feedback only
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  )
}
