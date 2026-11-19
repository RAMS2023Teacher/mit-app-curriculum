import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backend } from '../data'
import { useWatch } from '../data/hooks'
import type { ClassRoom } from '../types'
import type { DataInfo } from '../data/backend'
import { timeAgo } from '../components/ui'
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
      {backend.storage && <YourData />}
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

function YourData() {
  const [info, setInfo] = useState<DataInfo | null>(null)
  const { busy, error, run } = useAction()
  useEffect(() => {
    void run(async () => setInfo(await backend.storage!.info()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const backedUpToday = !!info && info.lastBackup === info.today
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>🗄️ Your data</h3>
      {!info && !error && <p className="muted">Checking…</p>}
      {error && <p className="error">{error}</p>}
      {info && (
        <>
          {info.otherData.length > 0 && (
            <div className="alert bad">
              ⚠️ This app has used more than one data sheet. Students' work may be in an older one:{' '}
              {info.otherData.map((u, i) => (
                <a key={u} href={u} target="_blank" rel="noreferrer">
                  older sheet {i + 1}{' '}
                </a>
              ))}
              . Don't delete anything. Ask for help moving it back.
            </div>
          )}
          <p style={{ fontWeight: 700 }}>
            {info.students} student{info.students === 1 ? '' : 's'} in {info.classes} class{info.classes === 1 ? '' : 'es'}, saved in a Google Sheet in your Drive.
          </p>
          <p className="small">
            {backedUpToday ? '✅ Backed up today' : '⏳ Not backed up yet today (it happens by itself while you use the app)'}
            {info.lastBackupAt > 0 && <span className="muted"> · last backup {timeAgo(info.lastBackupAt)}</span>}
            {info.backups.length > 0 && <span className="muted"> · keeping {info.backups.length} day{info.backups.length === 1 ? '' : 's'} (up to 8)</span>}
          </p>
          <div className="row">
            <a className="btn small" href={info.dataUrl} target="_blank" rel="noreferrer">
              Open the data sheet ↗
            </a>
            {info.backupsUrl && (
              <a className="btn small" href={info.backupsUrl} target="_blank" rel="noreferrer">
                Open backups ↗
              </a>
            )}
            <button className="small primary" disabled={busy} onClick={() => void run(async () => setInfo(await backend.storage!.backupNow()))}>
              Back up now
            </button>
          </div>
          <p className="small muted" style={{ marginBottom: 0 }}>
            Look, but don't edit these sheets by hand. Each backup is one dated tab holding every record.
          </p>
        </>
      )}
    </div>
  )
}
