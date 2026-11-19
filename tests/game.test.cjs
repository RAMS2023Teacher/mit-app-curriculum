// Personal XP, levels, badges, shop and avatar rules, checked through the real server (apps-script/Code.gs).
const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const path = require('path')
const { createMock } = require('./gas-mock.cjs')

const M = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'manifest.json'), 'utf8'))
const T = 'teacher@holliston.k12.ma.us'
const A = 'ava@holliston.k12.ma.us'
const B = 'ben@holliston.k12.ma.us'
const KEY = M.lessons['core-hello'].quiz
const WRONG = KEY.map((k) => (k + 1) % 4)

function setup() {
  const m = createMock()
  m.call(T, 'me'); m.call(T, 'setName', 'Mr. P'); m.call(T, 'setRole', 'teacher')
  const cls = m.call(T, 'createClass', 'Period 1')
  const a = m.call(A, 'me'); m.call(A, 'setName', 'Ava R.'); m.call(A, 'setRole', 'student'); m.call(A, 'joinClass', cls.joinCode)
  const b = m.call(B, 'me'); m.call(B, 'setName', 'Ben K.'); m.call(B, 'setRole', 'student'); m.call(B, 'joinClass', cls.joinCode)
  const co = m.call(A, 'createCompany', cls.id, { name: 'Co', tagline: '', logo: {} })
  m.call(B, 'joinCompany', cls.id, co.inviteCode)
  const quiz = (email, uid, answers) => m.call(email, 'recordQuiz', cls.id, co.id, 'core-hello', uid, { score: 99, total: 1, answers })
  const approve = (bonus = false) => {
    m.call(A, 'submit', cls.id, co.id, { lessonId: 'core-hello', link: 'x', notes: '' })
    const sub = m.call(T, 'snapshot', cls.id).submissions.find((s) => s.status === 'pending')
    m.call(T, 'review', cls.id, sub.id, { status: 'approved', feedback: '', bonusApproved: bonus })
  }
  return { m, cls, co, a, b, quiz, approve, player: (email) => m.call(email, 'player', cls.id) }
}

test('steps and mission start pay once each, and only for real lessons and steps', () => {
  const { m, cls, player } = setup()
  let r = m.call(A, 'earn', cls.id, [{ t: 'start', lesson: 'core-hello' }, { t: 'step', lesson: 'core-hello', i: 0 }])
  assert.equal(r.player.xp, M.xp.start + M.xp.step)
  r = m.call(A, 'earn', cls.id, [{ t: 'start', lesson: 'core-hello' }, { t: 'step', lesson: 'core-hello', i: 0 }])
  assert.equal(r.gained.length, 0)
  assert.equal(player(A).xp, M.xp.start + M.xp.step)
  assert.throws(() => m.call(A, 'earn', cls.id, [{ t: 'step', lesson: 'core-hello', i: 999 }]), /Unknown step/)
  assert.throws(() => m.call(A, 'earn', cls.id, [{ t: 'step', lesson: 'nope', i: 0 }]), /Unknown lesson/)
  assert.throws(() => m.call(A, 'earn', cls.id, [{ t: 'ship', lesson: 'core-hello' }]), /Unknown event/)
  assert.equal(player(A).xp, M.xp.start + M.xp.step)
})

test('the server marks the quiz from the answer key, not from the score the page sends', () => {
  const { m, cls, a, quiz } = setup()
  const bad = quiz(A, a.uid, WRONG)
  assert.deepEqual(bad.quiz, { score: 0, total: KEY.length, passed: false })
  assert.equal(bad.player.xp, 0)
  const saved = m.call(T, 'snapshot', cls.id).companies[0].quizzes['core-hello'][a.uid]
  assert.equal(saved.score, 0) // the page claimed 99
  const good = quiz(A, a.uid, KEY)
  assert.equal(good.quiz.passed, true)
  // Passed (30) + perfect (20), but NOT "perfect on the first try": the first try was wrong.
  assert.equal(good.player.xp, M.xp.quiz + M.xp.perfect + M.xp.badge) // + Quiz Whiz badge
  assert.ok(good.badges.includes('quiz-whiz'))
  assert.equal(quiz(A, a.uid, KEY).gained.length, 0) // retaking pays nothing more
})

test('a perfect first try pays the first-try bonus', () => {
  const { a, quiz } = setup()
  const r = quiz(A, a.uid, KEY)
  assert.ok(r.gained.some((g) => g.key === 'first:core-hello'))
})

test('shipping XP is paid only on teacher approval, to every partner; lesson complete needs your own quiz', () => {
  const { a, b, quiz, approve, player } = setup()
  quiz(A, a.uid, KEY)
  const before = player(A).xp
  approve(true)
  const pa = player(A); const pb = player(B)
  assert.ok(pa.awards['ship:core-hello'] && pa.awards['bonus:core-hello'] && pa.awards['done:core-hello'])
  assert.ok(pa.xp >= before + M.xp.ship + M.xp.bonus + M.xp.done)
  assert.ok(pa.awards['badge:team'] !== undefined, 'Team Player badge')
  // Ben has not passed the quiz yet: he gets ship XP but the lesson is not complete for him.
  assert.ok(pb.awards['ship:core-hello'] && pb.awards['done:core-hello'] === undefined)
  quiz(B, b.uid, KEY)
  assert.ok(player(B).awards['done:core-hello'])
})

test('a student cannot give themselves ship XP or a teacher badge', () => {
  const { m, cls, a } = setup()
  assert.throws(() => m.call(A, 'giveBadge', cls.id, a.uid), /Only the teacher/)
  assert.throws(() => m.call(A, 'review', cls.id, 'x', { status: 'approved' }), /Only the teacher/)
  assert.equal(m.call(T, 'giveBadge', cls.id, a.uid).given, true)
  assert.equal(m.call(T, 'giveBadge', cls.id, a.uid).given, false)
})

test('shop: the server checks the price and balance; levels never go down when XP is spent', () => {
  const { m, cls, a, quiz, approve, player } = setup()
  assert.throws(() => m.call(A, 'buy', cls.id, 'part:eyes:wink'), /You need 40 more XP/)
  assert.throws(() => m.call(A, 'buy', cls.id, 'part:eyes:stars'), /not for sale/) // a level item can't be bought
  assert.throws(() => m.call(A, 'buy', cls.id, 'part:eyes:nope'), /not for sale/)
  quiz(A, a.uid, KEY); approve()
  const rich = player(A); const level = m.ctx.Game.levelOf(rich.xp, M).n
  assert.ok(level >= 2)
  const r = m.call(A, 'buy', cls.id, 'part:eyes:wink')
  assert.equal(r.player.spent, 40)
  assert.equal(r.player.xp, rich.xp) // total earned is unchanged
  assert.equal(m.ctx.Game.levelOf(r.player.xp, M).n, level)
  assert.ok(r.player.owned['part:eyes:wink'])
  assert.throws(() => m.call(A, 'buy', cls.id, 'part:eyes:wink'), /already own/)
  // Power-ups go up one level at a time, each with its own price.
  const before = player(A)
  const afford = before.xp - before.spent
  if (afford >= M.powerups.magnet.prices[0]) {
    const pu = m.call(A, 'buy', cls.id, 'powerup:magnet')
    assert.equal(pu.player.powerups.magnet, 1)
    assert.equal(pu.player.spent, before.spent + M.powerups.magnet.prices[0])
  }
})

test('avatar: locked parts are refused; unlocked and bought parts are saved', () => {
  const { m, cls, a, quiz, approve, player } = setup()
  assert.throws(() => m.call(A, 'saveAvatar', cls.id, { eyes: 'shades' }), /still locked/)
  assert.throws(() => m.call(A, 'saveAvatar', cls.id, { top: 'crown' }), /Reach level 10/)
  assert.throws(() => m.call(A, 'saveAvatar', cls.id, { eyes: 'nope' }), /Unknown avatar part/)
  const r = m.call(A, 'saveAvatar', cls.id, { color: 'green', eyes: 'happy' })
  assert.equal(r.player.avatar.color, 'green')
  assert.equal(r.player.avatar.body, 'phone') // missing slots get the default
  assert.ok(r.badges.includes('style'))
  quiz(A, a.uid, KEY); approve()
  m.call(A, 'buy', cls.id, 'part:eyes:shades')
  assert.equal(m.call(A, 'saveAvatar', cls.id, { eyes: 'shades' }).player.avatar.eyes, 'shades')
  assert.equal(player(A).avatar.eyes, 'shades')
})

test('classmates see only XP and avatar, never award details; game saves do not rebuild the class summary', () => {
  const { m, cls } = setup()
  m.call(A, 'earn', cls.id, [{ t: 'step', lesson: 'core-hello', i: 0 }])
  m.clearCache()
  const snap = m.call(B, 'snapshot', cls.id)
  assert.deepEqual(Object.keys(snap.players[0]).sort(), ['avatar', 'uid', 'xp'])
  m.resetCounts()
  m.call(A, 'earn', cls.id, [{ t: 'step', lesson: 'core-hello', i: 1 }])
  assert.ok(m.count.cellReads <= 3)
  m.call(B, 'snapshot', cls.id)
  assert.equal(m.count.spanReads, 0)
})

test('one quiz save reads at most 3 records', () => {
  const { m, a, quiz } = setup()
  quiz(A, a.uid, WRONG); m.resetCounts(); quiz(A, a.uid, KEY)
  assert.ok(m.count.cellReads <= 3, 'read ' + m.count.cellReads)
})

test('the rules in Code.gs are the same as src/game/rules.js', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'game', 'rules.js'), 'utf8').replace(/^export /gm, '').trim()
  const code = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8')
  const inside = code.slice(code.indexOf('var Game = (function () {') + 26, code.indexOf('  return { newPlayer'))
  const norm = (t) => t.split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
  assert.equal(norm(inside), norm(src), 'Run npm run sync:server')
})
