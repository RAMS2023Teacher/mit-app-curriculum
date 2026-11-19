import { useState } from 'react'
import { backend } from '../data'
import { useWatch } from '../data/hooks'
import type { HelpRequest, HelpWhere } from '../types'
import { sfx } from '../lib/fx'
import { useAction } from './ui'

/** ✋ "I'm stuck: ask for help". Turns yellow while the teacher is on the way. */
export function HelpBox({ classId, where }: { classId: string; where: HelpWhere }) {
  const mine = useWatch<HelpRequest | null>(backend.help ? (cb) => backend.help!.watchMine(classId, cb) : null, [classId])
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const { busy, error, run } = useAction()
  if (!backend.help) return null

  if (mine)
    return (
      <div className="card help-box waiting" role="status">
        <h3 style={{ marginBottom: 4 }}>✋ Help is on the way!</h3>
        <p className="small" style={{ margin: '0 0 10px' }}>
          Keep trying while you wait. Your teacher can see where you are.
        </p>
        <button className="small" disabled={busy} onClick={() => void run(() => backend.help!.cancel(classId))}>
          I figured it out 👍
        </button>
        {error && <p className="error small">{error}</p>}
      </div>
    )

  return (
    <div className="card help-box">
      {!open ? (
        <button id="help-button" className="help-button" onClick={() => setOpen(true)}>
          ✋ I'm stuck: ask for help
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void run(async () => {
              await backend.help!.ask(classId, where, note.trim())
              sfx.ready()
              setOpen(false)
              setNote('')
            })
          }}
        >
          <label className="field" style={{ marginBottom: 8 }}>
            <span>What are you stuck on? (optional)</span>
            <input value={note} maxLength={140} autoFocus onChange={(e) => setNote(e.target.value)} placeholder="e.g. My button does nothing" />
          </label>
          <div className="row">
            <button className="primary" disabled={busy}>
              ✋ Ask my teacher
            </button>
            <button type="button" className="ghost small" onClick={() => setOpen(false)}>
              Never mind
            </button>
          </div>
          {error && <p className="error small">{error}</p>}
        </form>
      )}
    </div>
  )
}
