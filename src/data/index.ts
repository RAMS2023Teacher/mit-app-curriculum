import type { Backend } from './backend'
import { createLocalBackend, type DemoBackend } from './local'
import { createFirebaseBackend } from './firebase'
import { createAppsScriptBackend } from './appsscript'

const env = import.meta.env

/**
 * Which storage the app uses:
 * - VITE_BACKEND=appsscript → Google Apps Script + a Sheet in the teacher's school Drive (npm run build:appsscript)
 * - VITE_FIREBASE_API_KEY set → Firebase
 * - otherwise → demo mode (data stays in this browser)
 */
function pick(): Backend {
  if (env.VITE_BACKEND === 'appsscript') return createAppsScriptBackend()
  if (env.VITE_FIREBASE_API_KEY)
    return createFirebaseBackend({
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
  return createLocalBackend()
}

export const backend: Backend = pick()

export const demo: DemoBackend | null = backend.mode === 'demo' ? (backend as DemoBackend) : null
