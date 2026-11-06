import { ask } from './confirm'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { backend, demo } from '../data'
import { useAuth } from '../data/hooks'
import type { UserProfile } from '../types'

export const APP_INVENTOR_URL = 'https://ai2.appinventor.mit.edu/'

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const loc = useLocation()
  const classId = loc.pathname.match(/^\/class\/([^/]+)/)?.[1]
  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark">⚡</span> AppVenture
        </NavLink>
        <nav className="nav">
          {user?.role === 'teacher' && <NavLink to="/teacher" end>My classes</NavLink>}
          {user?.role === 'student' && <NavLink to="/student" end>Home</NavLink>}
          {classId && (
            <>
              <NavLink to={`/class/${classId}`} end>
                {user?.role === 'teacher' ? 'Class' : 'Dashboard'}
              </NavLink>
              <NavLink to={`/class/${classId}/tree`}>Tree</NavLink>
              <NavLink to={`/class/${classId}/leaderboard`}>Leaderboard</NavLink>
              {user?.role === 'student' && <NavLink to={`/class/${classId}/company`}>Company</NavLink>}
            </>
          )}
          <NavLink to="/lessons">Lessons</NavLink>
          {user?.role === 'teacher' && <NavLink to="/standards">Standards</NavLink>}
          <NavLink to="/phone">Phone setup</NavLink>
        </nav>
        <a className="btn small" href={APP_INVENTOR_URL} target="_blank" rel="noreferrer">
          Open App Inventor ↗
        </a>
        {user && (
          <div className="userchip">
            <span className="name">{user.name}</span>
            <button className="small ghost" onClick={() => backend.signOut()}>
              Sign out
            </button>
          </div>
        )}
      </header>
      <main>{children}</main>
      {demo && <DemoBar />}
    </>
  )
}

function DemoBar() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [users, setUsers] = useState<UserProfile[]>([])
  useEffect(() => setUsers(demo!.listUsers()), [user])
  return (
    <div className="demo-bar">
      <strong>Demo mode</strong>
      <span className="muted small" style={{ color: 'inherit', opacity: 0.7 }}>
        be:
      </span>
      <select
        value={user?.uid ?? ''}
        onChange={(e) => {
          demo!.switchUser(e.target.value || null)
          nav('/')
        }}
        aria-label="Switch demo user"
      >
        <option value="">(signed out)</option>
        {users
          .sort((a, b) => (a.role === b.role ? a.name.localeCompare(b.name) : a.role === 'teacher' ? -1 : 1))
          .map((u) => (
            <option key={u.uid} value={u.uid}>
              {u.role === 'teacher' ? '👩‍🏫 ' : '🧑‍🎓 '}
              {u.name}
            </option>
          ))}
      </select>
      <button
        className="small"
        onClick={async () => {
          if (await ask('Reset all demo data back to the sample class?', 'Reset demo')) {
            demo!.reset()
            nav('/')
          }
        }}
      >
        Reset
      </button>
    </div>
  )
}
