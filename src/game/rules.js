// Personal XP, levels, badges, shop and avatar rules.
// Plain JavaScript with no imports: this exact file runs in the browser (demo mode)
// AND is copied into apps-script/Code.gs by `npm run sync:server`, so both follow the same rules.
// `m` is the manifest (see src/game/manifest.ts): lessons, xp values, levels, badges, parts, power-ups.

export function newPlayer(uid) {
  return { uid: uid, xp: 0, spent: 0, awards: {}, log: [], quizFirst: {}, owned: {}, powerups: {}, shopLog: [], avatar: {}, avatarSet: false }
}

/** Levels count all XP ever earned, so they never go down when XP is spent. */
export function levelOf(xp, m) {
  let i = 0
  while (i + 1 < m.levels.length && xp >= m.levels[i + 1].min) i++
  return { n: i + 1, title: m.levels[i].title, min: m.levels[i].min, next: i + 1 < m.levels.length ? m.levels[i + 1].min : null }
}

export function spendable(p) {
  return p.xp - p.spent
}

export function hasBadge(p, id) {
  return p.awards['badge:' + id] !== undefined
}

/** Counts worked out from the award keys, so they can't get out of step with the XP. */
export function stats(p) {
  const s = { steps: 0, lessons: 0, perfect: 0, first: 0, bonus: 0, shipped: 0, team: 0 }
  for (const k in p.awards) {
    const t = k.slice(0, k.indexOf(':'))
    if (t === 'step') s.steps++
    else if (t === 'done') s.lessons++
    else if (t === 'perfect') s.perfect++
    else if (t === 'first') s.first++
    else if (t === 'bonus') s.bonus++
    else if (t === 'ship') s.shipped++
    else if (t === 'team') s.team++
  }
  return s
}

function badgeMet(p, rule, s) {
  switch (rule.type) {
    case 'steps': return s.steps >= rule.n
    case 'lessons': return s.lessons >= rule.n
    case 'perfect': return s.perfect >= rule.n
    case 'first': return s.first >= rule.n
    case 'bonus': return s.bonus >= rule.n
    case 'shipped': return s.shipped >= rule.n
    case 'team': return s.team >= 1
    case 'lesson': return p.awards['done:' + rule.id] !== undefined
    case 'anyLesson': return rule.ids.some(function (id) { return p.awards['done:' + id] !== undefined })
    case 'allLessons': return rule.ids.every(function (id) { return p.awards['done:' + id] !== undefined })
    case 'avatar': return !!p.avatarSet
    case 'gift': return p.awards['gift:' + rule.id] !== undefined
    default: return false
  }
}

/** Every award has a unique key, so nothing can be paid twice. */
function award(p, key, xp, label, out) {
  if (p.awards[key] !== undefined) return false
  p.awards[key] = xp
  p.xp += xp
  if (xp > 0) {
    p.log.unshift({ at: out.now, key: key, xp: xp, label: label })
    if (p.log.length > 20) p.log.length = 20
    out.gained.push({ key: key, xp: xp, label: label })
  }
  return true
}

function checkBadges(p, m, out) {
  let again = true
  while (again) {
    again = false
    const s = stats(p)
    for (const b of m.badges) {
      if (!hasBadge(p, b.id) && badgeMet(p, b.rule, s)) {
        award(p, 'badge:' + b.id, m.xp.badge, 'Badge: ' + b.name, out)
        out.badges.push(b.id)
        again = true
      }
    }
  }
}

function fail(msg) {
  throw new Error(msg)
}

/**
 * Apply one event to a player. ctx = { now, passPercent, team, trusted }.
 * "ship" and "gift" only happen on the teacher's say-so, so they need ctx.trusted.
 * Returns { gained[], badges[], level, levelUp, quiz? }.
 */
export function applyEvent(p, ev, m, ctx) {
  const out = { gained: [], badges: [], now: ctx.now, quiz: null, level: 0, levelUp: false }
  const before = levelOf(p.xp, m).n
  const L = ev.lesson ? m.lessons[ev.lesson] : null
  if (ev.t !== 'gift' && ev.t !== 'avatar' && !L) fail('Unknown lesson.')
  const name = L ? L.title : ''
  if (ev.t === 'start') {
    award(p, 'start:' + ev.lesson, m.xp.start, 'Mission accepted: ' + name, out)
  } else if (ev.t === 'step') {
    const i = Number(ev.i)
    if (!(i >= 0 && i < L.steps && Math.floor(i) === i)) fail('Unknown step.')
    award(p, 'step:' + ev.lesson + ':' + i, m.xp.step, 'Step ' + (i + 1) + ': ' + name, out)
  } else if (ev.t === 'quiz') {
    const a = ev.answers
    if (!Array.isArray(a) || a.length !== L.quiz.length) fail('That quiz does not match the lesson. Reload the page and try again.')
    let score = 0
    for (let i = 0; i < L.quiz.length; i++) if (a[i] === L.quiz[i]) score++
    const total = L.quiz.length
    const passed = (score / total) * 100 >= (ctx.passPercent || 70)
    const firstTry = !p.quizFirst[ev.lesson]
    if (firstTry) p.quizFirst[ev.lesson] = { score: score, total: total, at: ctx.now }
    if (passed) award(p, 'quiz:' + ev.lesson, m.xp.quiz, 'Quiz passed: ' + name, out)
    if (score === total) {
      award(p, 'perfect:' + ev.lesson, m.xp.perfect, 'Perfect quiz: ' + name, out)
      if (firstTry) award(p, 'first:' + ev.lesson, m.xp.first, 'Perfect on the first try: ' + name, out)
    }
    out.quiz = { score: score, total: total, passed: passed }
  } else if (ev.t === 'ship') {
    if (!ctx.trusted) fail('Only your teacher can approve a build.')
    award(p, 'ship:' + ev.lesson, m.xp.ship, 'Build approved: ' + name, out)
    if (ev.bonus) award(p, 'bonus:' + ev.lesson, m.xp.bonus, 'Bonus quest: ' + name, out)
  } else if (ev.t === 'gift') {
    if (!ctx.trusted) fail('Only your teacher can give that.')
    award(p, 'gift:' + ev.badge, 0, '', out)
  } else if (ev.t !== 'avatar') {
    fail('Unknown event.')
  }
  // Whole lesson complete: this student passed the quiz AND the build is approved.
  if (L && p.awards['quiz:' + ev.lesson] !== undefined && p.awards['ship:' + ev.lesson] !== undefined) {
    if (award(p, 'done:' + ev.lesson, m.xp.done, 'Lesson complete: ' + name, out) && ctx.team) award(p, 'team:' + ev.lesson, 0, '', out)
  }
  checkBadges(p, m, out)
  out.level = levelOf(p.xp, m).n
  out.levelUp = out.level > before
  return out
}

/** Is this item available to the player? `key` is like "eyes:shades". */
export function unlocked(p, key, m) {
  const part = m.parts[key]
  if (!part) return false
  const r = part.rule
  if (r.type === 'none') return true
  if (r.type === 'level') return levelOf(p.xp, m).n >= r.n
  if (r.type === 'badge') return hasBadge(p, r.id)
  if (r.type === 'cost') return p.owned['part:' + key] !== undefined
  return false
}

/** How to get a locked item, in words. */
export function howToGet(key, m) {
  const r = m.parts[key].rule
  if (r.type === 'level') return 'Reach level ' + r.n
  if (r.type === 'badge') {
    const b = m.badges.filter(function (x) { return x.id === r.id })[0]
    return 'Earn the badge "' + (b ? b.name : r.id) + '"'
  }
  if (r.type === 'cost') return 'Buy for ' + r.n + ' XP'
  return ''
}

/** Buy "part:<slot>:<id>" or the next level of "powerup:<id>". The price and balance are checked here, never in the page. */
export function buy(p, item, m, now) {
  let price, label
  if (item.indexOf('part:') === 0) {
    const key = item.slice(5)
    const part = m.parts[key]
    if (!part || part.rule.type !== 'cost') fail('That item is not for sale.')
    if (p.owned[item] !== undefined) fail('You already own that.')
    price = part.rule.n
    label = part.name
  } else if (item.indexOf('powerup:') === 0) {
    const id = item.slice(8)
    const pu = m.powerups[id]
    if (!pu) fail('That item is not for sale.')
    const next = (p.powerups[id] || 0) + 1
    if (next > pu.prices.length) fail('That power-up is already at its top level.')
    price = pu.prices[next - 1]
    label = pu.name + ' level ' + next
  } else fail('That item is not for sale.')
  const have = spendable(p)
  if (have < price) fail('You need ' + (price - have) + ' more XP to buy that.')
  p.spent += price
  if (item.indexOf('part:') === 0) p.owned[item] = now
  else p.powerups[item.slice(8)] = (p.powerups[item.slice(8)] || 0) + 1
  p.shopLog.unshift({ at: now, item: item, price: price, label: label })
  if (p.shopLog.length > 30) p.shopLog.length = 30
  return { price: price, label: label }
}

export function defaultAvatar(m) {
  const a = {}
  for (const slot of m.slots) a[slot] = m.slotDefaults[slot]
  return a
}

/** Save an avatar. Refuses any item the player has not unlocked. */
export function setAvatar(p, avatar, m) {
  const clean = {}
  const def = defaultAvatar(m)
  let custom = false
  for (const slot of m.slots) {
    const id = avatar && typeof avatar[slot] === 'string' ? avatar[slot] : def[slot]
    const key = slot + ':' + id
    if (!m.parts[key]) fail('Unknown avatar part.')
    if (!unlocked(p, key, m)) fail('"' + m.parts[key].name + '" is still locked. ' + howToGet(key, m) + '.')
    clean[slot] = id
    if (id !== def[slot]) custom = true
  }
  p.avatar = clean
  if (custom) p.avatarSet = true
}
