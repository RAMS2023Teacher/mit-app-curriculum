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
        <h1>Build apps. Launch a company. Level up.</h1>
        <p className="lead">
          AppVenture is a gamified MIT App Inventor course. Team up with a partner, design your company logo, and climb the
          skill tree from your first button to an original app you pitch on Launch Day.
        </p>
        {!demo && (
          <button className="primary" disabled={busy} onClick={() => run(() => backend.signIn())} style={{ fontSize: '1.05rem', padding: '12px 22px' }}>
            Sign in with Google
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </section>

      {demo && <DemoPicker />}

      <div className="grid cols-3" style={{ marginTop: 32 }}>
        {[
          ['🏢', 'Form a company', 'Partner up, pick a name and design a logo. Your logo moves up the tree as you learn.'],
          ['🌳', 'Climb the tree', 'Events → variables → conditionals → loops → lists → procedures. Then the tree branches.'],
          ['🔀', 'Choose your path', 'Become a Game Studio, Media House or Tool Works and build a capstone app of your own design.'],
          ['📱', 'Test on your phone', 'Build in App Inventor and see changes live on your phone with the AI Companion.'],
          ['✅', 'Auto-checked builds', 'Upload your .aia file and AppVenture looks inside to check you used the right blocks.'],
          ['⭐', 'Earn XP & badges', 'Quizzes, approved builds and bonus challenges earn XP. Go from Garage Startup to Tech Giant.'],
        ].map(([icon, title, body]) => (
          <div className="card feature" key={title}>
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p className="muted" style={{ margin: 0 }}>
              {body}
            </p>
          </div>
        ))}
      </div>
      <p className="center" style={{ marginTop: 28 }}>
        <Link to="/lessons">Browse the full curriculum →</Link>
      </p>
    </div>
  )
}

function DemoPicker() {
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('student')
  const quick = [
    { uid: 'demo-teacher', label: '👩‍🏫 Teacher', desc: 'Review builds, see every company on the tree' },
    { uid: 's-ava', label: '🏴‍☠️ Ava · Pixel Pirates', desc: 'A Game Studio partway down the games path' },
    { uid: 's-zoe', label: '🛠️ Zoe · ByteSize Tools', desc: 'Has teacher feedback to fix' },
    { uid: 's-riley', label: '🧑‍🎓 Riley', desc: 'In the class but has no company yet' },
  ]
  return (
    <div className="card" style={{ maxWidth: 820, margin: '0 auto' }}>
      <h2>Try the demo</h2>
      <p className="muted">
        Firebase is not configured yet, so AppVenture is running in <strong>demo mode</strong> with a sample class. Data is
        saved only in this browser. Tip: open a second tab as a different person and watch them update each other.
      </p>
      <div className="grid cols-2" style={{ gap: 10 }}>
        {quick.map((q) => (
          <button key={q.uid} onClick={() => demo!.switchUser(q.uid)} style={{ display: 'block', textAlign: 'left', padding: 14 }}>
            <div>{q.label}</div>
            <div className="small muted" style={{ fontWeight: 400 }}>
              {q.desc}
            </div>
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
        <input placeholder="Or make a new demo user: your name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={{ width: 'auto' }}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button className="primary" type="submit">
          Go
        </button>
      </form>
      <p className="small muted" style={{ marginBottom: 0 }}>
        New students can join the sample class with code <code>DEMO42</code>.
      </p>
    </div>
  )
}
