import { useState } from 'react'
import { Link } from 'react-router-dom'
import { backend } from '../data'
import type { Company, Submission } from '../types'
import { getLesson } from '../curriculum'
import { AiaReportView } from '../components/AiaReportView'
import { CompanyName, timeAgo, useAction } from '../components/ui'

export function ReviewQueue({ classId, submissions, companies }: { classId: string; submissions: Submission[]; companies: Company[] }) {
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')
  const list = submissions.filter((s) => filter === 'all' || s.status === 'pending')
  return (
    <div>
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
