import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { backend } from './data'
import { AuthContext, useAuth } from './data/hooks'
import type { UserProfile } from './types'
import { Layout } from './components/Layout'
import { Landing } from './pages/Landing'
import { RoleSelect } from './pages/RoleSelect'
import { TeacherHome } from './pages/TeacherHome'
import { StudentHome } from './pages/StudentHome'
import { ClassHub } from './pages/ClassHub'
import { TreePage } from './pages/TreePage'
import { LessonPage } from './pages/LessonPage'
import { Library } from './pages/Library'
import { CompanyPage } from './pages/CompanyPage'
import { Leaderboard } from './pages/Leaderboard'
import { PhoneGuide } from './pages/PhoneGuide'
import { StandardsPage } from './pages/StandardsPage'
import { ClassScreen } from './pages/ClassScreen'

function Home() {
  const { user } = useAuth()
  if (!user) return <Landing />
  if (!user.role) return <RoleSelect />
  return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />
}

function RequireUser({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  if (!user.role) return <RoleSelect />
  return <>{children}</>
}

export default function App() {
  const [auth, setAuth] = useState<{ user: UserProfile | null; loading: boolean }>({ user: null, loading: true })
  useEffect(() => backend.onAuth((user) => setAuth({ user, loading: false })), [])
  if (auth.loading) return <div className="page center muted">Loading…</div>
  return (
    <AuthContext.Provider value={auth}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teacher" element={<RequireUser><TeacherHome /></RequireUser>} />
            <Route path="/student" element={<RequireUser><StudentHome /></RequireUser>} />
            <Route path="/class/:classId" element={<RequireUser><ClassHub /></RequireUser>} />
            <Route path="/class/:classId/tree" element={<RequireUser><TreePage /></RequireUser>} />
            <Route path="/class/:classId/lesson/:lessonId" element={<RequireUser><LessonPage /></RequireUser>} />
            <Route path="/class/:classId/company" element={<RequireUser><CompanyPage /></RequireUser>} />
            <Route path="/class/:classId/screen" element={<RequireUser><ClassScreen /></RequireUser>} />
            <Route path="/class/:classId/leaderboard" element={<RequireUser><Leaderboard /></RequireUser>} />
            <Route path="/lessons" element={<Library />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/phone" element={<PhoneGuide />} />
            <Route path="/standards" element={<StandardsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthContext.Provider>
  )
}
