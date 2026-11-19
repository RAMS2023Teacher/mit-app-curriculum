import { ask } from './confirm'
import { usePlayer } from '../game/hooks'
import { MANIFEST } from '../game/manifest'
import { levelOf, spendable } from '../game/rules.js'
import { setSound, soundOn } from '../lib/fx'
import { startNudges } from '../lib/nudge'
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
  // Idle hints are for students only (teachers would only see them in a student view).
  const isStudent = user?.role === 'student' || (!!user && !user.role)
  useEffect(() => {
    if (!isStudent) return
    return startNudges({
      report: (idle) => {
        const cid = window.location.hash.match(/^#\/class\/([^/]+)/)?.[1]
        if (cid && backend.help) void backend.help.idle(cid, idle)
      },
    })
  }, [isStudent])
  // The projector Class Screen uses the whole display: no menu, no demo bar.
  if (/^\/class\/[^/]+\/screen$/.test(loc.pathname)) return <main>{children}</main>
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
              {user?.role === 'student' && backend.game && <NavLink to={`/class/${classId}/me`}>Me</NavLink>}
            </>
          )}
          <NavLink to="/lessons">Lessons</NavLink>
          {user?.role === 'teacher' && <NavLink to="/standards">Standards</NavLink>}
          <NavLink to="/phone">Phone setup</NavLink>
        </nav>
        {user?.role === 'student' && classId && backend.game && <XpChip classId={classId} />}
        <SoundToggle />
        <a className="btn small" href={APP_INVENTOR_URL} target="_blank" rel="noreferrer">
          Open App Inventor ↗
        </a>
        {user && (
          <div className="userchip">
            <span className="name">{user.name}</span>
            {backend.mode !== 'appsscript' && (
              <button className="small ghost" onClick={() => backend.signOut()}>
                Sign out
              </button>
            )}
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

/** "⚡ 165 · Lv 3" in the top bar: XP to spend and level. Stars fly here when XP is earned. */
function XpChip({ classId }: { classId: string }) {
  const player = usePlayer(classId)
  if (!player) return null
  return (
    <NavLink to={`/class/${classId}/me`} id="xp-chip" className="xp-chip" title="XP to spend. Open your buddy and the shop." aria-label={`${spendable(player)} XP to spend, level ${levelOf(player.xp, MANIFEST).n}`}>
      ⚡ {spendable(player)} <small>Lv {levelOf(player.xp, MANIFEST).n}</small>
    </NavLink>
  )
}

function SoundToggle() {
  const [on, setOn] = useState(soundOn())
  useEffect(() => {
    const f = () => setOn(soundOn())
    window.addEventListener('appventure-sound', f)
    return () => window.removeEventListener('appventure-sound', f)
  }, [])
  return (
    <button className="small ghost sound-toggle" aria-pressed={on} aria-label={on ? 'Sound is on. Turn sound off' : 'Sound is off. Turn sound on'} title={on ? 'Sound on' : 'Sound off'} onClick={() => setSound(!on)}>
      {on ? '🔊' : '🔇'}
    </button>
  )
}
