// Idle hints: "what do I do next?"
// After 45 quiet seconds the next thing to do glows and a 👉 bubble says what it is.
// After 2 minutes the glow gets stronger, the ✋ help button glows too, and the class display is told
// the student is idle. It never asks for help on the student's behalf.
//
// What to point at is worked out from the page: the first visible element with data-nudge="what to do".
// Pages put that attribute only on the thing that is next, so new lessons need no extra code here.
import { reduceMotion } from './fx'

const T = {
  first: 45_000,
  second: 120_000,
  /** Away from the tab this long → "Welcome back!" hint soon after returning. */
  away: 20_000,
  back: 3_000,
  /** Mouse movement lets a hint fade after this long (clicks and keys clear it at once). */
  fade: 7_000,
  /** While still idle, tell the class display again this often (it forgets after 5 minutes). */
  report: 120_000,
  ...((window as unknown as { __NUDGE?: Record<string, number> }).__NUDGE ?? {}), // tests shorten these
}

type Opts = { report?: (idle: boolean) => void }

let opts: Opts = {}
let lastActive = Date.now()
let hiddenAt = 0
let welcome = 0 // show a "Welcome back!" hint at this time
let level = 0
let target: Element | null = null
let bubble: HTMLElement | null = null
let fadeTimer = 0
let reportedAt = 0
let timer = 0

const visible = (el: Element) => {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'
}
const blocked = () => !!document.querySelector('.ask-backdrop, .spotlight') || [...document.querySelectorAll('video')].some((v) => !v.paused)
const findTarget = () => [...document.querySelectorAll('[data-nudge]')].find(visible) ?? null

function clear() {
  target?.classList.remove('nudge-glow', 'nudge-strong')
  document.getElementById('help-button')?.classList.remove('nudge-glow')
  bubble?.remove()
  bubble = null
  target = null
  level = 0
  window.clearTimeout(fadeTimer)
  fadeTimer = 0
}

function place() {
  if (!bubble || !target) return
  const r = target.getBoundingClientRect()
  const off = r.bottom < 60 || r.top > window.innerHeight - 40
  bubble.classList.toggle('docked', off)
  if (off) {
    bubble.style.left = '50%'
    bubble.style.top = ''
    bubble.querySelector('.nudge-hand')!.textContent = '👇'
  } else {
    bubble.querySelector('.nudge-hand')!.textContent = '👉'
    const w = bubble.offsetWidth
    bubble.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px'
    const above = r.top - bubble.offsetHeight - 10
    bubble.style.top = (above > 64 ? above : r.bottom + 10) + 'px'
  }
}

function show(next: number, hello = false) {
  const el = findTarget()
  if (!el || blocked()) return
  if (target !== el) clear()
  target = el
  level = next
  el.classList.add('nudge-glow')
  el.classList.toggle('nudge-strong', next >= 2)
  if (reduceMotion()) el.classList.add('nudge-still')
  if (!bubble) {
    bubble = document.createElement('div')
    bubble.className = 'nudge-bubble'
    bubble.setAttribute('role', 'status')
    bubble.innerHTML = '<span class="nudge-hand">👉</span> <span class="nudge-text"></span><div class="nudge-more"></div>'
    bubble.addEventListener('click', () => target?.scrollIntoView({ block: 'center', behavior: reduceMotion() ? 'auto' : 'smooth' }))
    document.body.appendChild(bubble)
  }
  bubble.querySelector('.nudge-text')!.textContent = (hello ? 'Welcome back! ' : '') + (el.getAttribute('data-nudge') || 'Try this next')
  const help = document.getElementById('help-button')
  const more = bubble.querySelector('.nudge-more') as HTMLElement
  if (next >= 2 && help) {
    help.classList.add('nudge-glow')
    more.textContent = 'Still stuck? Press ✋ and your teacher will come over.'
  } else more.textContent = ''
  place()
}

function report(idle: boolean) {
  if (idle) {
    reportedAt = Date.now()
    opts.report?.(true)
  } else if (reportedAt) {
    reportedAt = 0
    opts.report?.(false)
  }
}

function tick() {
  if (document.hidden) return
  const now = Date.now()
  if (welcome && now >= welcome) {
    welcome = 0
    show(1, true)
    return
  }
  const idle = now - lastActive
  if (idle >= T.second) {
    if (level < 2) show(2)
    // Tell the class display, and again every 2 minutes while still idle.
    if (!reportedAt || now - reportedAt >= T.report) report(true)
  } else if (idle >= T.first && level < 1) show(1)
  if (bubble) {
    // The thing to do may have changed or gone (e.g. the step moved on).
    if (!target?.isConnected || findTarget() !== target) {
      const keep = level
      clear()
      show(keep)
    } else place()
  }
}

function active(hard: boolean) {
  lastActive = Date.now()
  report(false)
  if (!level) return
  if (hard) clear()
  else if (!fadeTimer) fadeTimer = window.setTimeout(clear, T.fade) // mouse movement: let it fade
}

function onVisibility() {
  if (document.hidden) {
    hiddenAt = Date.now()
    // Switching tabs (for example to App Inventor) is not idling.
    report(false)
    clear()
  } else {
    if (hiddenAt && Date.now() - hiddenAt >= T.away) welcome = Date.now() + T.back
    hiddenAt = 0
    lastActive = Date.now() // time in another tab does not count as idle
  }
}

const hard = () => active(true)
const soft = () => active(false)

/** Start idle hints for a student. Returns a function that stops them. */
export function startNudges(o: Opts = {}) {
  opts = o
  lastActive = Date.now()
  window.addEventListener('pointerdown', hard, true)
  window.addEventListener('keydown', hard, true)
  window.addEventListener('mousemove', soft, true)
  window.addEventListener('scroll', soft, true)
  document.addEventListener('visibilitychange', onVisibility)
  timer = window.setInterval(tick, 1000)
  return () => {
    window.removeEventListener('pointerdown', hard, true)
    window.removeEventListener('keydown', hard, true)
    window.removeEventListener('mousemove', soft, true)
    window.removeEventListener('scroll', soft, true)
    document.removeEventListener('visibilitychange', onVisibility)
    window.clearInterval(timer)
    report(false)
    clear()
  }
}
