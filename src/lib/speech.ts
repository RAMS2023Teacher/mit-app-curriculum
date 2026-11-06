/** Read text aloud with the browser's built-in voices (no network needed). */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

const plain = (t: string) =>
  t
    .replace(/\*\*|`/g, '')
    .replace(/^\s*[-*] /gm, '')
    .replace(/^\s*\d+\. /gm, '')
    .replace(/_{3,}/g, 'blank')
    .replace(/→/g, ', then ')

export function speak(text: string, onEnd?: () => void) {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(plain(text))
  u.rate = 0.95
  u.onend = () => onEnd?.()
  u.onerror = () => onEnd?.()
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}
