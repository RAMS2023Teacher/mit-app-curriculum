import { useEffect, useState } from 'react'
import { canSpeak, speak, stopSpeaking } from '../lib/speech'

/** 🔊 button that reads the given text aloud; tap again to stop. */
export function SpeakButton({ text, label = 'Read aloud' }: { text: string; label?: string }) {
  const [on, setOn] = useState(false)
  useEffect(() => () => stopSpeaking(), [])
  if (!canSpeak()) return null
  return (
    <button
      type="button"
      className="small"
      aria-pressed={on}
      aria-label={on ? 'Stop reading' : label}
      title={on ? 'Stop reading' : label}
      onClick={() => {
        if (on) {
          stopSpeaking()
          setOn(false)
        } else {
          setOn(true)
          speak(text, () => setOn(false))
        }
      }}
    >
      {on ? '⏹' : '🔊'}
    </button>
  )
}
