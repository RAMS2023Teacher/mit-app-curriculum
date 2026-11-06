import { useState } from 'react'
import { backend } from '../data'
import type { ClassRoom, LogoSpec } from '../types'
import { DEFAULT_LOGO } from '../components/Logo'
import { LogoEditor } from '../components/LogoEditor'
import { useAction } from '../components/ui'

export function CompanySetup({ cls }: { cls: ClassRoom }) {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [logo, setLogo] = useState<LogoSpec>(DEFAULT_LOGO)
  const [code, setCode] = useState('')
  const { busy, error, run } = useAction()
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <h1 className="sky-title">Start your company</h1>
      <p style={{ fontWeight: 800 }}>
        Teams of up to {cls.settings.maxCompanySize}. One partner creates it, the others join with the invite code.
      </p>
      <div className="tabs">
        <button className={mode === 'create' ? 'active' : ''} onClick={() => setMode('create')}>
          🏢 Create a company
        </button>
        <button className={mode === 'join' ? 'active' : ''} onClick={() => setMode('join')}>
          🤝 Join my partner's company
        </button>
      </div>
      {mode === 'create' ? (
        <form
          className="card"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => backend.createCompany(cls.id, { name: name.trim(), tagline: tagline.trim(), logo }))
          }}
        >
          <div className="grid cols-2" style={{ gap: 12 }}>
            <label className="field">
              <span>Company name</span>
              <input
                required
                maxLength={28}
                value={name}
                placeholder="e.g. Pixel Pirates"
                onChange={(e) => {
                  setName(e.target.value)
                  if (!logo.initials || logo.initials === initials(name)) setLogo({ ...logo, initials: initials(e.target.value) })
                }}
              />
            </label>
            <label className="field">
              <span>Slogan</span>
              <input maxLength={48} value={tagline} placeholder="e.g. Games worth the plunder" onChange={(e) => setTagline(e.target.value)} />
            </label>
          </div>
          <h3>Design your logo</h3>
          <LogoEditor value={logo} onChange={setLogo} />
          <button className="go big" disabled={busy || !name.trim()} style={{ marginTop: 16 }}>
            🚀 Found {name.trim() || 'my company'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <form
          className="card"
          style={{ maxWidth: 440 }}
          onSubmit={(e) => {
            e.preventDefault()
            run(() => backend.joinCompany(cls.id, code))
          }}
        >
          <p style={{ fontWeight: 800 }}>Type your partner's 5-letter invite code.</p>
          <input className="code-input" maxLength={5} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="XXXXX" aria-label="Invite code" />
          <button className="primary" style={{ marginTop: 12 }} disabled={busy || code.length < 5}>
            Join company
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  )
}

const initials = (s: string) =>
  s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
