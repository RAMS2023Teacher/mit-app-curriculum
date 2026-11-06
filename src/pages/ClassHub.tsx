import { useParams } from 'react-router-dom'
import { useClassData } from '../data/hooks'
import { Loading } from '../components/ui'
import { TeacherClass } from './TeacherClass'
import { StudentDashboard } from './StudentDashboard'
import { CompanySetup } from './CompanySetup'

export function ClassHub() {
  const { classId } = useParams()
  const data = useClassData(classId)
  if (data.loading) return <Loading />
  if (!data.cls) return <div className="page">Class not found. It may have been deleted.</div>
  if (data.isTeacher) return <TeacherClass data={data} />
  if (!data.myMember) return <div className="page">You are not a member of this class.</div>
  if (!data.myCompany) return <CompanySetup cls={data.cls} />
  return <StudentDashboard data={data} />
}
