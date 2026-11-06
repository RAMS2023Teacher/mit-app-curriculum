import { useEffect, useState } from 'react'

/** Per-viewer display preferences, remembered in this browser. */
export function usePref(key: string, initial: boolean): [boolean, (v: boolean) => void] {
  const full = `appventure-pref-${key}`
  const [v, setV] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(full)
      return raw === null ? initial : raw === '1'
    } catch {
      return initial
    }
  })
  useEffect(() => {
    const on = (e: StorageEvent) => e.key === full && setV(e.newValue === '1')
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [full])
  const set = (next: boolean) => {
    setV(next)
    try {
      localStorage.setItem(full, next ? '1' : '0')
    } catch {
      /* ignore */
    }
  }
  return [v, set]
}
