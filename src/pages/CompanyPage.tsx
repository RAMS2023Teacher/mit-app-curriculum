import { ask } from '../components/confirm'
import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { backend } from '../data'
import { useClassData } from '../data/hooks'
import type { LogoSpec } from '../types'
import { LogoEditor } from '../components/LogoEditor'
import { Loading, XpBar, useAction } from '../components/ui'
import { LESSONS_IN_ORDER } from '../curriculum'

export function CompanyPage() {
  const { classId } = useParams()
  const data = useClassData(classId)
  const co = data.myCompany
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [logo, setLogo] = useState<LogoSpec | null>(null)
  const { busy, error, run } = useAction()
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    if (co && !logo) {
      setName(co.name)
      setTagline(co.tagline)
      setLogo(co.logo)
    }
  }, [co, logo])
  if (data.loading) return <Loading />
  if (!co || !logo) return <Navigate to={`/class/${classId}`} replace />
  const p = data.progress.get(co.id)!
  const earned = LESSONS_IN_ORDER.filter((l) => p.lessons[l.id]?.xp > 0)

  return (
    <div className="page">
      <h1>Company HQ</h1>
      <div className="grid cols-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <h3>🤝 Invite your partner</h3>
          <p>Your partner joins the class, picks "Join my partner's company" and types this code:</p>
          <div className="code-input" style={{ fontWeight: 700, fontSize: '2rem' }}>
            {co.inviteCode}
          </div>
          <p className="small muted">
            Members: {Object.values(co.memberNames).join(', ')} ({co.memberIds.length}/{data.cls?.settings.maxCompanySize})
          </p>
          <button
            className="small danger"
            onClick={() => void ask(`Leave ${co.name}? ${co.memberIds.length === 1 ? 'You are the last member, so the company and its XP will be deleted.' : ''}`).then((ok) => { if (ok) void backend.leaveCompany(classId!, co.id) })}
          >
            Leave company
          </button>
        </div>
        <div className="card">
          <h3>📈 XP earned</h3>
          <XpBar progress={p} />
          <div className="table-wrap" style={{ maxHeight: 220, overflowY: 'auto', marginTop: 10 }}>
            <table className="list small">
              <tbody>
                {earned.map((l) => {
                  const lp = p.lessons[l.id]
                  return (
                    <tr key={l.id}>
                      <td>
                        {l.icon} {l.title}
                      </td>
                      <td className="muted">
                        {lp.quizPassed && 'quiz '}
                        {lp.buildApproved && '· build '}
                        {lp.bonusApproved && '· ⭐ bonus'}
                      </td>
                      <td className="xp-num">+{lp.xp}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {earned.length === 0 && <p className="muted small">Nothing yet. Pass a quiz to earn your first XP!</p>}
          </div>
        </div>
      </div>
      <form
        className="card"
        onSubmit={async (e) => {
          e.preventDefault()
          if (await run(() => backend.updateCompany(classId!, co.id, { name: name.trim() || co.name, tagline: tagline.trim(), logo }))) setSaved(true)
        }}
      >
        <h3>🎨 Brand</h3>
        <div className="grid cols-2" style={{ gap: 12 }}>
          <label className="field">
            <span>Company name</span>
            <input maxLength={28} value={name} onChange={(e) => (setName(e.target.value), setSaved(false))} />
          </label>
          <label className="field">
            <span>Slogan</span>
            <input maxLength={48} value={tagline} onChange={(e) => (setTagline(e.target.value), setSaved(false))} />
          </label>
        </div>
        <LogoEditor value={logo} onChange={(l) => (setLogo(l), setSaved(false))} />
        <button className="primary" disabled={busy} style={{ marginTop: 12 }}>
          Save brand
        </button>
        {saved && <span className="small muted"> Saved ✓</span>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
