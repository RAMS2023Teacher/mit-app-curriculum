import { useEffect, useRef, useState } from 'react'
import { reduceMotion, sfx } from '../lib/fx'

/**
 * A button that is grey when it isn't ready, but still clickable: clicking it explains what's
 * missing, buzzes, and points at the thing to do. It turns green with a chime when ready.
 */
export function LockedButton({
  ready,
  missing,
  target,
  onClick,
  className = '',
  children,
  disabled,
}: {
  ready: boolean
  /** What still has to be done, e.g. "pick an answer". Shown as "To go on: …". */
  missing: string
  /** The element to outline and scroll to when a locked button is clicked. */
  target?: () => Element | null | undefined
  onClick: () => void
  className?: string
  children: React.ReactNode
  /** Truly disabled (e.g. while saving). */
  disabled?: boolean
}) {
  const [shake, setShake] = useState(false)
  const [pop, setPop] = useState(false)
  const was = useRef(ready)
  useEffect(() => {
    if (ready && !was.current) {
      sfx.ready()
      setPop(true)
      const t = setTimeout(() => setPop(false), 600)
      was.current = ready
      return () => clearTimeout(t)
    }
    was.current = ready
  }, [ready])
  const click = () => {
    if (ready) return onClick()
    sfx.buzz()
    setShake(true)
    setTimeout(() => setShake(false), 600)
    const el = target?.()
    if (el) {
      el.classList.add('need')
      el.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' })
      setTimeout(() => el.classList.remove('need'), 2600)
    }
  }
  return (
    <span className="locked-wrap">
      <button type="button" className={`${className} ${ready ? '' : 'locked'} ${shake ? 'shake' : ''} ${pop ? 'ready-pop' : ''}`} aria-disabled={!ready} disabled={disabled} onClick={click}>
        {children}
      </button>
      {!ready && (
        <span className={`togo ${shake ? 'red' : ''}`} role="status">
          To go on: {missing}
        </span>
      )}
    </span>
  )
}
