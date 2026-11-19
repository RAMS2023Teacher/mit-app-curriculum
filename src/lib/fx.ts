// Game feel: sounds (made with Web Audio, no files) and small celebrations.
// "Less motion" (the system setting) keeps the sounds and drops the movement.
import { BADGES, LEVELS } from '../game/catalog'
import type { GameResult } from '../game/types'
import { celebrate } from '../components/ui'

const SOUND_KEY = 'appventure-sound'
let audio: AudioContext | null = null
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

export const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function soundOn() {
  try {
    return localStorage.getItem(SOUND_KEY) !== '0'
  } catch {
    return true
  }
}
export function setSound(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('appventure-sound'))
}

// Browsers only allow sound after the first click or key press.
const unlock = () => {
  try {
    audio ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    void audio.resume()
  } catch {
    /* no audio on this device */
  }
}
window.addEventListener('pointerdown', (e) => ((pointer = { x: e.clientX, y: e.clientY }), unlock()), { capture: true })
window.addEventListener('keydown', unlock, { capture: true })

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'sine', vol = 0.12) {
  if (!audio || !soundOn()) return
  const t = audio.currentTime + at
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(audio.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}
const run = (notes: [number, number, number, OscillatorType?][]) => notes.forEach(([f, at, d, type]) => tone(f, at, d, type ?? 'triangle'))

export const sfx = {
  tick: () => tone(880, 0, 0.06, 'square', 0.05),
  coin: () => run([[988, 0, 0.08, 'square'], [1319, 0.08, 0.22, 'square']]),
  pass: () => run([[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.12], [1047, 0.36, 0.3]]),
  badge: () => run([[659, 0, 0.1], [784, 0.1, 0.1], [988, 0.2, 0.1], [1319, 0.3, 0.1], [1568, 0.4, 0.35]]),
  levelUp: () => run([[392, 0, 0.14], [523, 0.14, 0.14], [659, 0.28, 0.14], [784, 0.42, 0.14], [1047, 0.56, 0.45], [784, 0.56, 0.45]]),
  buy: () => run([[1568, 0, 0.07, 'square'], [2093, 0.07, 0.07, 'square'], [1047, 0.16, 0.3, 'triangle']]),
  buzz: () => run([[110, 0, 0.22, 'sawtooth'], [98, 0.05, 0.2, 'sawtooth']]),
  ready: () => run([[784, 0, 0.08], [1175, 0.08, 0.2]]),
}

function el(tag: string, cls: string, text = '') {
  const e = document.createElement(tag)
  e.className = cls
  e.textContent = text
  return e
}

/** "+35 XP" floats up from where the student clicked, and stars fly into the XP chip. */
function floatXp(xp: number) {
  const note = el('div', 'xp-float', `+${xp} XP`)
  note.setAttribute('role', 'status')
  const still = reduceMotion()
  if (still) note.classList.add('still')
  note.style.left = Math.min(window.innerWidth - 90, Math.max(60, pointer.x)) + 'px'
  note.style.top = Math.max(70, pointer.y - 20) + 'px'
  document.body.appendChild(note)
  setTimeout(() => note.remove(), still ? 1600 : 1200)
  const chip = document.getElementById('xp-chip')
  if (still || !chip) return
  const to = chip.getBoundingClientRect()
  for (let i = 0; i < 5; i++) {
    const star = el('div', 'xp-star', '⭐')
    star.style.left = pointer.x + 'px'
    star.style.top = pointer.y + 'px'
    document.body.appendChild(star)
    const dx = to.left + to.width / 2 - pointer.x
    const dy = to.top + to.height / 2 - pointer.y
    requestAnimationFrame(() =>
      setTimeout(() => {
        star.style.transform = `translate(${dx}px, ${dy}px) scale(0.4)`
        star.style.opacity = '0.2'
      }, i * 70),
    )
    setTimeout(() => star.remove(), 900 + i * 70)
  }
  setTimeout(() => {
    chip.classList.add('bump')
    setTimeout(() => chip.classList.remove('bump'), 400)
  }, 600)
}

// Badge spotlight: one card at a time, each closes by itself after about 4 seconds.
const queue: (() => void)[] = []
let showing = false
function next() {
  const job = queue.shift()
  if (!job) return (showing = false)
  showing = true
  job()
}
function spotlight(icon: string, kicker: string, title: string, sub: string, sound: () => void) {
  queue.push(() => {
    sound()
    const back = el('div', 'spotlight')
    back.setAttribute('role', 'status')
    const card = el('div', 'spotlight-card' + (reduceMotion() ? '' : ' pop'))
    card.append(el('div', 'spotlight-icon', icon), el('div', 'spotlight-kicker', kicker), el('div', 'spotlight-title', title), el('div', 'spotlight-sub', sub))
    back.appendChild(card)
    const close = () => {
      if (!back.isConnected) return
      back.remove()
      next()
    }
    back.addEventListener('click', close)
    document.body.appendChild(back)
    setTimeout(close, 4000)
  })
  if (!showing) next()
}

/** Celebrate whatever a game action just earned. */
export function showGain(r: GameResult | null | void) {
  if (!r) return
  const xp = r.gained.reduce((s, g) => s + g.xp, 0)
  if (xp > 0) {
    sfx.coin()
    floatXp(xp)
  }
  for (const id of r.badges) {
    const b = BADGES.find((x) => x.id === id)
    if (b) spotlight(b.icon, 'New badge!', b.name, b.desc, sfx.badge)
  }
  if (r.levelUp) {
    spotlight('🎉', 'Level up!', `Level ${r.level}`, LEVELS[r.level - 1]?.title ?? '', sfx.levelUp)
    if (!reduceMotion()) celebrate()
  }
}

/** Coins burst out when something is bought. */
export function coinBurst() {
  sfx.buy()
  if (reduceMotion()) return
  for (let i = 0; i < 10; i++) {
    const c = el('div', 'xp-star', '🪙')
    c.style.left = pointer.x + 'px'
    c.style.top = pointer.y + 'px'
    document.body.appendChild(c)
    const a = (Math.PI * 2 * i) / 10
    requestAnimationFrame(() => {
      c.style.transform = `translate(${Math.cos(a) * 90}px, ${Math.sin(a) * 90}px)`
      c.style.opacity = '0'
    })
    setTimeout(() => c.remove(), 800)
  }
}
