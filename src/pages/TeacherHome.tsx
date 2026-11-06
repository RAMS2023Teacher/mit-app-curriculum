import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backend } from '../data'
import { useWatch } from '../data/hooks'
import type { ClassRoom } from '../types'
import { useAction } from '../components/ui'
import { CourseList } from './ClassroomTab'

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
      {backend.classroom && <ImportFromClassroom />}
    </div>
  )
}

function ImportFromClassroom() {
  const [open, setOpen] = useState(false)
  const { error, run } = useAction()
  const nav = useNavigate()
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="spread">
        <div>
          <h3 style={{ margin: 0 }}>🎓 Import from Google Classroom</h3>
          <p className="small muted" style={{ margin: '4px 0 0' }}>
            Makes an AppVenture class from a Classroom course and adds its students (first name + last initial). Students skip the join code.
          </p>
        </div>
        {!open && (
          <button className="primary" onClick={() => setOpen(true)}>
            Choose a course
          </button>
        )}
      </div>
      {open && (
        <div style={{ marginTop: 12 }}>
          <CourseList
            busyLabel="Import"
            onPick={(c) =>
              void run(async () => {
                const r = await backend.classroom!.importCourse(c.id)
                nav(`/class/${r.classId}`)
              })
            }
          />
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
