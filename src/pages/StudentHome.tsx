import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { backend } from '../data'
import { useWatch } from '../data/hooks'
import type { ClassRoom } from '../types'
import { Loading, useAction } from '../components/ui'

export function JoinClass() {
  const [code, setCode] = useState('')
  const { busy, error, run } = useAction()
  const nav = useNavigate()
  return (
    <form
      className="card"
      style={{ maxWidth: 440, margin: '0 auto' }}
      onSubmit={(e) => {
        e.preventDefault()
        run(async () => {
          const c = await backend.joinClass(code)
          nav(`/class/${c.id}`)
        })
      }}
    >
      <h2>Join a class</h2>
      <p className="muted">Enter the code your teacher gave you.</p>
      <input className="code-input" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ABC123" aria-label="Class code" />
      <button className="primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} disabled={busy || code.length < 6}>
        Join class
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

export function StudentHome() {
  const classes = useWatch<ClassRoom[]>((cb) => backend.watchMyClasses(cb), [])
  const [joining, setJoining] = useState(false)
  if (!classes) return <Loading />
  if (classes.length === 1 && !joining) return <Navigate to={`/class/${classes[0].id}`} replace />
  return (
    <div className="page">
      {classes.length > 0 && (
        <>
          <h1>My classes</h1>
          <div className="grid cols-3" style={{ marginBottom: 24 }}>
            {classes.map((c) => (
              <Link key={c.id} to={`/class/${c.id}`} className="card">
                <h3>{c.name}</h3>
                <div className="muted small">{c.teacherName}</div>
              </Link>
            ))}
          </div>
        </>
      )}
      {classes.length === 0 || joining ? (
        <JoinClass />
      ) : (
        <button onClick={() => setJoining(true)}>Join another class</button>
      )}
    </div>
  )
}
