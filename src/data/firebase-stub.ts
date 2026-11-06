// Used instead of firebase.ts in the Apps Script build, so the Firebase SDK isn't bundled.
import type { Backend } from './backend'
export function createFirebaseBackend(_env: unknown): Backend {
  throw new Error('Firebase is not included in this build.')
}
