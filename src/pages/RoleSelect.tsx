import { useState } from 'react'
import { backend } from '../data'
import { useAuth } from '../data/hooks'
import { useAction } from '../components/ui'

export function RoleSelect() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const { busy, error, run } = useAction()
  const choose = (role: 'teacher' | 'student') =>
    run(async () => {
      if (name.trim() && name.trim() !== user?.name) await backend.setName(name.trim())
      await backend.setRole(role)
    })
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1>Welcome to AppVenture!</h1>
      <label className="field">
        <span>Your first name and last initial (classmates see this)</span>
        <input value={name} maxLength={24} placeholder="e.g. Ava R." onChange={(e) => setName(e.target.value)} />
        <span className="small muted" style={{ fontWeight: 600 }}>
          Don't use your full name or anything private.
        </span>
      </label>
      <div className="grid cols-2">
        <button className="card" disabled={busy || !name.trim()} onClick={() => choose('student')} style={{ display: 'block', textAlign: 'left' }}>
          <div style={{ fontSize: '2rem' }}>🧑‍🎓</div>
          <h3>I'm a student</h3>
          <p className="muted" style={{ margin: 0, fontWeight: 400 }}>
            Join a class with a code, form a company and start building.
          </p>
        </button>
        <button className="card" disabled={busy || !name.trim()} onClick={() => choose('teacher')} style={{ display: 'block', textAlign: 'left' }}>
          <div style={{ fontSize: '2rem' }}>👩‍🏫</div>
          <h3>I'm a teacher</h3>
          <p className="muted" style={{ margin: 0, fontWeight: 400 }}>
            Create classes, follow every company on the tree and review builds.
          </p>
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  )
}
