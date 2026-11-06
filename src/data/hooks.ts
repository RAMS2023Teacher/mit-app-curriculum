import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Approval, ClassRoom, Company, Member, Submission, UserProfile } from '../types'
import { backend } from '.'
import type { Unsub } from './backend'
import { computeProgress } from '../lib/progress'

/** Subscribe to a backend watcher. Returns undefined while loading. */
export function useWatch<T>(subscribe: ((cb: (v: T) => void) => Unsub) | null, deps: unknown[]): T | undefined {
  const [value, setValue] = useState<T | undefined>(undefined)
  useEffect(() => {
    setValue(undefined)
    if (!subscribe) return
    return subscribe(setValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return value
}

export const AuthContext = createContext<{ user: UserProfile | null; loading: boolean }>({ user: null, loading: true })
export const useAuth = () => useContext(AuthContext)

export const useClass = (classId?: string) =>
  useWatch<ClassRoom | null>(classId ? (cb) => backend.watchClass(classId, cb) : null, [classId])
export const useMembers = (classId?: string) =>
  useWatch<Member[]>(classId ? (cb) => backend.watchMembers(classId, cb) : null, [classId])
export const useCompanies = (classId?: string) =>
  useWatch<Company[]>(classId ? (cb) => backend.watchCompanies(classId, cb) : null, [classId])
export const useSubmissions = (classId?: string, companyId?: string | null) =>
  useWatch<Submission[]>(
    classId && companyId !== undefined ? (cb) => backend.watchSubmissions(classId, companyId, cb) : null,
    [classId, companyId],
  )

/** Everything a class page needs, with progress computed per company. */
export function useClassData(classId?: string) {
  const { user } = useAuth()
  const cls = useClass(classId)
  const members = useMembers(classId)
  const companies = useCompanies(classId)
  const isTeacher = !!cls && !!user && cls.teacherId === user.uid
  const myMember = members?.find((m) => m.uid === user?.uid)
  const myCompany = companies?.find((c) => c.id === myMember?.companyId) ?? null
  // Teachers see all submissions; students only their own company's.
  const subsCompany = cls === undefined || members === undefined ? undefined : isTeacher ? null : (myCompany?.id ?? '__none__')
  const submissions = useSubmissions(classId, subsCompany)
  const approvals = useWatch<Approval[]>(classId ? (cb) => backend.watchApprovals(classId, cb) : null, [classId])
  const pass = cls?.settings.quizPassPercent ?? 70
  const progress = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeProgress>>()
    for (const c of companies ?? []) map.set(c.id, computeProgress(c, submissions ?? [], approvals ?? [], pass))
    return map
  }, [companies, submissions, approvals, pass])
  const loading = cls === undefined || members === undefined || companies === undefined || submissions === undefined || approvals === undefined
  return { cls, members, companies, submissions, progress, isTeacher, myMember, myCompany, loading }
}
