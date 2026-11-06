import { initializeApp, type FirebaseOptions } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth'
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import type { Approval, ClassRoom, Company, Member, Submission, UserProfile } from '../types'
import { DEFAULT_SETTINGS, makeCode, type Backend, type Unsub } from './backend'

export interface FirebaseEnv {
  options: FirebaseOptions
  /** e.g. "myschool.org": only accounts on this domain may sign in. */
  allowedDomain?: string
  /** Emails allowed to choose the teacher role. Empty = anyone. */
  teacherEmails: string[]
}

export function createFirebaseBackend(env: FirebaseEnv): Backend {
  const app = initializeApp(env.options)
  const auth = getAuth(app)
  const db = getFirestore(app)

  const uid = () => {
    const u = auth.currentUser
    if (!u) throw new Error('Not signed in')
    return u.uid
  }
  const userRef = (id: string) => doc(db, 'users', id)
  const classRef = (cid: string) => doc(db, 'classes', cid)
  const memberRef = (cid: string, id: string) => doc(db, 'classes', cid, 'members', id)
  const companies = (cid: string) => collection(db, 'classes', cid, 'companies')
  const subs = (cid: string) => collection(db, 'classes', cid, 'submissions')
  const withId = <T,>(d: { id: string; data: () => unknown }) => ({ ...(d.data() as object), id: d.id }) as T

  const myName = async () => ((await getDoc(userRef(uid()))).data() as UserProfile | undefined)?.name ?? 'Student'

  const api: Backend = {
    mode: 'firebase',

    onAuth(cb) {
      let unsubProfile: Unsub | null = null
      const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
        unsubProfile?.()
        unsubProfile = null
        if (!fbUser) return cb(null)
        if (env.allowedDomain && !fbUser.email?.toLowerCase().endsWith('@' + env.allowedDomain.toLowerCase())) {
          await fbSignOut(auth)
          alert(`Please sign in with your @${env.allowedDomain} account.`)
          return cb(null)
        }
        const ref = userRef(fbUser.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          const profile: Omit<UserProfile, 'uid'> = {
            name: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'New user',
            email: fbUser.email ?? undefined,
            role: null,
            classIds: [],
          }
          await setDoc(ref, JSON.parse(JSON.stringify(profile)))
        }
        unsubProfile = onSnapshot(ref, (s) => cb(s.exists() ? withId<UserProfile>({ id: s.id, data: () => ({ ...s.data(), uid: s.id }) }) : null))
      })
      return () => {
        unsubAuth()
        unsubProfile?.()
      }
    },
    async signIn() {
      const provider = new GoogleAuthProvider()
      if (env.allowedDomain) provider.setCustomParameters({ hd: env.allowedDomain })
      await signInWithPopup(auth, provider)
    },
    async signOut() {
      await fbSignOut(auth)
    },
    async setRole(role) {
      const email = auth.currentUser?.email?.toLowerCase() ?? ''
      if (role === 'teacher' && env.teacherEmails.length && !env.teacherEmails.includes(email)) {
        throw new Error('This account is not on the teacher list. Ask your administrator, or choose Student.')
      }
      await updateDoc(userRef(uid()), { role })
    },
    async setName(name) {
      await updateDoc(userRef(uid()), { name })
    },

    async createClass(name) {
      const me = uid()
      const ref = doc(collection(db, 'classes'))
      const c: Omit<ClassRoom, 'id'> = {
        name,
        teacherId: me,
        teacherName: await myName(),
        joinCode: makeCode(),
        createdAt: Date.now(),
        settings: { ...DEFAULT_SETTINGS },
      }
      const batch = writeBatch(db)
      batch.set(ref, c)
      batch.update(userRef(me), { classIds: arrayUnion(ref.id) })
      await batch.commit()
      return { ...c, id: ref.id }
    },
    async joinClass(code) {
      const me = uid()
      const found = await getDocs(query(collection(db, 'classes'), where('joinCode', '==', code.trim().toUpperCase()), limit(1)))
      if (found.empty) throw new Error('No class found with that code. Check with your teacher.')
      const c = withId<ClassRoom>(found.docs[0])
      const existing = await getDoc(memberRef(c.id, me))
      const batch = writeBatch(db)
      if (!existing.exists()) {
        const m: Omit<Member, 'uid'> & { uid: string } = {
          uid: me,
          name: await myName(),
          email: auth.currentUser?.email ?? undefined,
          companyId: null,
          joinedAt: Date.now(),
        }
        batch.set(memberRef(c.id, me), JSON.parse(JSON.stringify(m)))
      }
      batch.update(userRef(me), { classIds: arrayUnion(c.id) })
      await batch.commit()
      return c
    },
    async updateClass(classId, patch) {
      await updateDoc(classRef(classId), patch)
    },
    async deleteClass(classId) {
      await deleteDoc(classRef(classId))
      await updateDoc(userRef(uid()), { classIds: arrayRemove(classId) })
    },
    watchClass(classId, cb) {
      return onSnapshot(classRef(classId), (s) => cb(s.exists() ? withId<ClassRoom>(s) : null), () => cb(null))
    },
    watchMyClasses(cb) {
      let inner: Unsub | null = null
      const outer = onSnapshot(userRef(uid()), (s) => {
        inner?.()
        const ids = ((s.data()?.classIds as string[]) ?? []).slice(0, 30)
        if (!ids.length) return cb([])
        inner = onSnapshot(query(collection(db, 'classes'), where(documentId(), 'in', ids)), (q) =>
          cb(q.docs.map((d) => withId<ClassRoom>(d)).sort((a, b) => b.createdAt - a.createdAt)),
        )
      })
      return () => {
        outer()
        inner?.()
      }
    },
    watchMembers(classId, cb) {
      return onSnapshot(collection(db, 'classes', classId, 'members'), (q) =>
        cb(q.docs.map((d) => ({ ...(d.data() as Member), uid: d.id })).sort((a, b) => a.name.localeCompare(b.name))),
      )
    },
    async removeMember(classId, memberUid) {
      const m = (await getDoc(memberRef(classId, memberUid))).data() as Member | undefined
      if (m?.companyId) await api.leaveCompany(classId, m.companyId, memberUid)
      await deleteDoc(memberRef(classId, memberUid))
    },

    watchCompanies(classId, cb) {
      return onSnapshot(companies(classId), (q) =>
        cb(q.docs.map((d) => withId<Company>(d)).sort((a, b) => a.createdAt - b.createdAt)),
      )
    },
    async createCompany(classId, data) {
      const me = uid()
      const name = await myName()
      const ref = doc(companies(classId))
      const c: Omit<Company, 'id'> = {
        classId,
        ...data,
        memberIds: [me],
        memberNames: { [me]: name },
        inviteCode: makeCode(5),
        choices: {},
        quizzes: {},
        createdAt: Date.now(),
      }
      await runTransaction(db, async (tx) => {
        const m = await tx.get(memberRef(classId, me))
        if (m.data()?.companyId) throw new Error('You are already in a company.')
        tx.set(ref, c)
        tx.update(memberRef(classId, me), { companyId: ref.id })
      })
      return { ...c, id: ref.id }
    },
    async joinCompany(classId, inviteCode) {
      const me = uid()
      const name = await myName()
      const found = await getDocs(query(companies(classId), where('inviteCode', '==', inviteCode.trim().toUpperCase()), limit(1)))
      if (found.empty) throw new Error('No company found with that invite code.')
      const ref = found.docs[0].ref
      const cls = (await getDoc(classRef(classId))).data() as ClassRoom
      return runTransaction(db, async (tx) => {
        const snap = await tx.get(ref)
        const c = withId<Company>(snap)
        if (!c.memberIds.includes(me)) {
          if (c.memberIds.length >= cls.settings.maxCompanySize)
            throw new Error(`That company is full (max ${cls.settings.maxCompanySize} people).`)
          tx.update(ref, { memberIds: arrayUnion(me), [`memberNames.${me}`]: name })
        }
        tx.update(memberRef(classId, me), { companyId: c.id })
        return c
      })
    },
    async leaveCompany(classId, companyId, who) {
      const target = who ?? uid()
      const ref = doc(companies(classId), companyId)
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref)
        if (!snap.exists()) return
        const c = snap.data() as Company
        if (c.memberIds.length <= 1 && c.memberIds.includes(target)) tx.delete(ref)
        else tx.update(ref, { memberIds: arrayRemove(target), [`memberNames.${target}`]: deleteField() })
        tx.update(memberRef(classId, target), { companyId: null })
      })
    },
    async updateCompany(classId, companyId, patch) {
      await updateDoc(doc(companies(classId), companyId), patch)
    },
    async chooseBranch(classId, companyId, branchId, lessonId) {
      await updateDoc(doc(companies(classId), companyId), { [`choices.${branchId}`]: lessonId ?? deleteField() })
    },
    async recordQuiz(classId, companyId, lessonId, result) {
      const ref = doc(companies(classId), companyId)
      const c = (await getDoc(ref)).data() as Company
      const prev = c.quizzes?.[lessonId]
      if (!prev || result.score / result.total >= prev.score / prev.total) {
        await updateDoc(ref, { [`quizzes.${lessonId}`]: result })
      }
    },

    watchSubmissions(classId, companyId, cb) {
      const q = companyId ? query(subs(classId), where('companyId', '==', companyId)) : subs(classId)
      return onSnapshot(q, (s) =>
        cb(s.docs.map((d) => withId<Submission>(d)).sort((a, b) => b.submittedAt - a.submittedAt)),
      )
    },
    async submit(classId, company, sub) {
      const me = uid()
      const ref = doc(subs(classId))
      const s: Omit<Submission, 'id'> = {
        classId,
        companyId: company.id,
        companyName: company.name,
        ...sub,
        status: 'pending',
        feedback: '',
        bonusApproved: false,
        submittedBy: me,
        submittedByName: await myName(),
        submittedAt: Date.now(),
        reviewedAt: null,
      }
      await setDoc(ref, JSON.parse(JSON.stringify(s)))
    },
    async review(classId, submissionId, review) {
      const subRef = doc(subs(classId), submissionId)
      const sub = withId<Submission>(await getDoc(subRef))
      const approvalRef = doc(db, 'classes', classId, 'approvals', `${sub.companyId}__${sub.lessonId}`)
      const batch = writeBatch(db)
      batch.update(subRef, { ...review, reviewedAt: Date.now() })
      if (review.status === 'approved') {
        const a: Approval = { id: approvalRef.id, companyId: sub.companyId, lessonId: sub.lessonId, bonus: review.bonusApproved, at: Date.now() }
        batch.set(approvalRef, a, { merge: true })
      } else if (sub.status === 'approved') {
        // Un-approving a build removes its XP.
        batch.delete(approvalRef)
      }
      await batch.commit()
    },
    watchApprovals(classId, cb) {
      return onSnapshot(collection(db, 'classes', classId, 'approvals'), (q) => cb(q.docs.map((d) => withId<Approval>(d))))
    },
  }
  return api
}
