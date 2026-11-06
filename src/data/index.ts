import type { Backend } from './backend'
import { createLocalBackend, type DemoBackend } from './local'
import { createFirebaseBackend } from './firebase'

const env = import.meta.env

/** Firebase is used when VITE_FIREBASE_API_KEY is set (see .env.example). Otherwise demo mode. */
export const backend: Backend = env.VITE_FIREBASE_API_KEY
  ? createFirebaseBackend({
      options: {
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        appId: env.VITE_FIREBASE_APP_ID,
      },
      allowedDomain: env.VITE_ALLOWED_DOMAIN || undefined,
      teacherEmails: (env.VITE_TEACHER_EMAILS ?? '')
        .split(',')
        .map((e: string) => e.trim().toLowerCase())
        .filter(Boolean),
    })
  : createLocalBackend()

export const demo: DemoBackend | null = backend.mode === 'demo' ? (backend as DemoBackend) : null
