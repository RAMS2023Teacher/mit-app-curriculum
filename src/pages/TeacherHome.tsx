import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backend } from '../data'
import { useWatch } from '../data/hooks'
import type { ClassRoom } from '../types'
import { useAction } from '../components/ui'

export function TeacherHome() {
  const classes = useWatch<ClassRoom[]>((cb) => backend.watchMyClasses(cb), [])
  const [name, setName] = useState('')
  const { busy, error, run } = useAction()
  const nav = useNavigate()
  return (
    <div className="page">
      <div className="spread">
        <h1>My classes</h1>
        <Link to="/lessons" className="btn">
          📚 Review the curriculum
        </Link>
      </div>
      <div className="grid cols-3">
        {classes?.map((c) => (
          <Link key={c.id} to={`/class/${c.id}`} className="card">
            <h3>{c.name}</h3>
            <div className="small muted">Join code</div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.4rem', letterSpacing: '0.15em', fontWeight: 700 }}>{c.joinCode}</div>
          </Link>
        ))}
        <form
          className="card flat"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            run(async () => {
              const c = await backend.createClass(name.trim())
              nav(`/class/${c.id}`)
            })
          }}
        >
          <h3>➕ New class</h3>
          <label className="field">
            <span>Class name</span>
            <input placeholder="e.g. Period 4 · App Development" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <button className="primary" disabled={busy || !name.trim()}>
            Create class
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      {classes?.length === 0 && <p className="muted">Create your first class, then share its join code with students.</p>}
    </div>
  )
}
