import { useState } from 'react'
import { Link } from 'react-router-dom'
import { backend, demo } from '../data'
import { useAction } from '../components/ui'
import type { Role } from '../types'

export function Landing() {
  const { busy, error, run } = useAction()
  return (
    <div className="page">
      <section className="hero">
        <h1 className="sky-title">Build apps. Level up.</h1>
        <p className="lead">Start a company with a partner, climb the skill tree, and ship real apps to your phone.</p>
        {!demo && (
          <button className="go big" disabled={busy} onClick={() => run(() => backend.signIn())}>
            ▶ Sign in with Google
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </section>

      {demo && <DemoPicker />}

      <div className="grid cols-3" style={{ marginTop: 28 }}>
        {[
          ['🏢', 'Start a company', 'Pick a name. Design a logo.'],
          ['🗺️', 'Climb the tree', 'Unlock new skills.'],
          ['🔀', 'Pick your path', 'Games, media or tools.'],
          ['📱', 'Test on your phone', 'See your app live.'],
          ['⭐', 'Earn XP', 'Quizzes, builds, bonus quests.'],
          ['🏆', 'Top the leaderboard', 'Garage Startup → Tech Giant.'],
        ].map(([icon, title, body]) => (
          <div className="card feature" key={title}>
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p className="muted" style={{ margin: 0, fontWeight: 700 }}>
              {body}
            </p>
          </div>
        ))}
      </div>
      <p className="center" style={{ marginTop: 28 }}>
        <Link to="/lessons" className="btn">
          📚 See all the lessons
        </Link>
      </p>
    </div>
  )
}

function DemoPicker() {
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('student')
  const quick = [
    { uid: 'demo-teacher', icon: '👩‍🏫', bg: '#ffe066', label: 'Teacher', desc: 'Review builds, see everyone' },
    { uid: 's-ava', icon: '🏴‍☠️', bg: '#ff9aa2', label: 'Ava', desc: 'Pixel Pirates · game path' },
    { uid: 's-zoe', icon: '🛠️', bg: '#8ef0d0', label: 'Zoe', desc: 'ByteSize Tools · has a fix to do' },
    { uid: 's-riley', icon: '🧑‍🎓', bg: '#b4c9ff', label: 'Riley', desc: 'New, no company yet' },
  ]
  return (
    <div className="card" style={{ maxWidth: 820, margin: '0 auto' }}>
      <h2>🎮 Pick a player</h2>
      <p className="muted" style={{ fontWeight: 700 }}>Demo with a sample class. Nothing leaves this browser.</p>
      <div className="grid cols-2" style={{ gap: 12 }}>
        {quick.map((q) => (
          <button key={q.uid} onClick={() => demo!.switchUser(q.uid)} style={{ textAlign: 'left', padding: 12, gap: 12 }}>
            <span className="avatar" style={{ background: q.bg }}>
              {q.icon}
            </span>
            <span>
              <span style={{ display: 'block', fontSize: '1.25rem' }}>{q.label}</span>
              <span className="small muted" style={{ fontFamily: 'var(--body)', fontWeight: 700 }}>
                {q.desc}
              </span>
            </span>
          </button>
        ))}
      </div>
      <form
        className="row"
        style={{ marginTop: 16 }}
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          demo!.switchUser(demo!.createUser(name.trim(), role))
        }}
      >
        <input placeholder="Or type a new player name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={{ width: 'auto' }}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button className="go" type="submit">
          Go
        </button>
      </form>
      <p className="small muted" style={{ marginBottom: 0 }}>
        New students can join the sample class with code <code>DEMO42</code>.
      </p>
    </div>
  )
}
