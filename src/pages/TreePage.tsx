import { Link, useNavigate, useParams } from 'react-router-dom'
import { useClassData } from '../data/hooks'
import { Tree, TreeLegend } from '../components/Tree'
import { Loading, XpBar } from '../components/ui'
import { BRANCHES, TREE } from '../curriculum/tree'
import { getLesson } from '../curriculum'
import { Logo } from '../components/Logo'

export function TreePage() {
  const { classId } = useParams()
  const data = useClassData(classId)
  const nav = useNavigate()
  if (data.loading) return <Loading />
  if (!data.cls) return <div className="page">Class not found.</div>
  const mine = data.myCompany
  const p = mine ? data.progress.get(mine.id) : undefined
  const forkId = p?.position.startsWith('fork:') ? p.position.slice(5) : null
  return (
    <div className="page wide">
      <div className="spread" style={{ marginBottom: 12 }}>
        <div>
          <h1 style={{ marginBottom: 0 }}>Progression tree</h1>
          <div className="muted small">{data.cls.name}</div>
        </div>
        {mine && p && (
          <div className="card flat row" style={{ padding: '10px 16px', minWidth: 320 }}>
            <Logo logo={mine.logo} size={44} />
            <div style={{ flex: 1 }}>
              <strong>{mine.name}</strong>
              <XpBar progress={p} />
            </div>
          </div>
        )}
      </div>
      {forkId && (
        <div className="alert warn">
          <strong>🔀 {BRANCHES[forkId].label}!</strong> {BRANCHES[forkId].description}{' '}
          <span className="row" style={{ marginTop: 8 }}>
            {TREE.filter((n) => n.branchId === forkId).map((n) => {
              const l = getLesson(n.lessonId)!
              return (
                <Link key={n.lessonId} className="btn small" to={`/class/${classId}/lesson/${n.lessonId}`}>
                  {l.icon} {l.title}
                </Link>
              )
            })}
          </span>
        </div>
      )}
      <TreeLegend />
      <Tree
        companies={data.companies ?? []}
        progress={data.progress}
        viewerCompanyId={mine?.id}
        showCounts={data.isTeacher}
        onSelect={(id) => nav(`/class/${classId}/lesson/${id}`)}
      />
    </div>
  )
}
