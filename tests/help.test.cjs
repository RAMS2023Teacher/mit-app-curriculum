// ✋ Help requests and idle markers, checked through the real server (apps-script/Code.gs).
const test = require('node:test')
const assert = require('node:assert/strict')
const { createMock } = require('./gas-mock.cjs')

const T = 'teacher@holliston.k12.ma.us'
const A = 'ava@holliston.k12.ma.us'
const B = 'ben@holliston.k12.ma.us'
const WHERE = { lesson: 'core-loops', stage: 'build', step: 4, label: 'Loops & Timers · Step 5: The timer loop' }

function setup() {
  const m = createMock()
  m.call(T, 'me'); m.call(T, 'setName', 'Mr. P'); m.call(T, 'setRole', 'teacher')
  const cls = m.call(T, 'createClass', 'Period 1')
  const ids = {}
  for (const [e, n] of [[A, 'Ava R.'], [B, 'Ben K.']]) { ids[e] = m.call(e, 'me').uid; m.call(e, 'setName', n); m.call(e, 'setRole', 'student'); m.call(e, 'joinClass', cls.joinCode) }
  return { m, cls, ids }
}

test('a student asks for help; the teacher sees who, where and the note; no emails', () => {
  const { m, cls, ids } = setup()
  m.call(A, 'helpAsk', cls.id, WHERE, 'My countdown never stops ' + 'x'.repeat(200))
  const desk = m.call(T, 'desk', cls.id)
  assert.equal(desk.help.length, 1)
  assert.equal(desk.help[0].name, 'Ava R.')
  assert.equal(desk.help[0].where, WHERE.label)
  assert.equal(desk.help[0].note.length, 140) // notes are capped
  assert.equal(desk.help[0].uid, ids[A])
  assert.ok(!JSON.stringify(desk).includes('@'))
})

test('one request per student; students see only their own', () => {
  const { m, cls } = setup()
  m.call(A, 'helpAsk', cls.id, WHERE, 'first'); m.call(A, 'helpAsk', cls.id, WHERE, 'second')
  m.call(B, 'helpAsk', cls.id, WHERE, 'me too')
  assert.equal(m.call(T, 'desk', cls.id).help.length, 2)
  const mine = m.call(A, 'desk', cls.id)
  assert.deepEqual(Object.keys(mine), ['mine'])
  assert.equal(mine.mine.note, 'second')
})

test('"I figured it out" and "Helped" clear the request; only the teacher can mark helped', () => {
  const { m, cls, ids } = setup()
  m.call(A, 'helpAsk', cls.id, WHERE, ''); m.call(B, 'helpAsk', cls.id, WHERE, '')
  m.call(A, 'helpCancel', cls.id)
  assert.equal(m.call(A, 'desk', cls.id).mine, null)
  assert.throws(() => m.call(A, 'helpDone', cls.id, ids[B]), /Only the teacher/)
  m.call(T, 'helpDone', cls.id, ids[B])
  assert.equal(m.call(B, 'desk', cls.id).mine, null)
  assert.equal(m.call(T, 'desk', cls.id).help.length, 0)
})

test('requests expire after an hour', () => {
  const { m, cls } = setup()
  m.call(A, 'helpAsk', cls.id, WHERE, '')
  m.advance(61 * 60 * 1000)
  assert.equal(m.call(T, 'desk', cls.id).help.length, 0)
  assert.equal(m.call(A, 'desk', cls.id).mine, null)
})

test('help requests are counted per lesson step on the student record', () => {
  const { m, cls } = setup()
  m.call(A, 'helpAsk', cls.id, WHERE, ''); m.call(A, 'helpAsk', cls.id, WHERE, '')
  m.call(A, 'helpAsk', cls.id, { lesson: 'core-loops', stage: 'quiz', label: 'Loops & Timers · Quiz' }, '')
  assert.deepEqual(m.call(A, 'player', cls.id).fb['core-loops'].help, { 'step:4': 2, quiz: 1 })
})

test('polling the desk does not read the sheet, and asking reads at most 3 records', () => {
  const { m, cls } = setup()
  m.call(A, 'helpAsk', cls.id, WHERE, ''); m.call(T, 'desk', cls.id); m.call(A, 'desk', cls.id)
  m.resetCounts()
  for (let i = 0; i < 5; i++) { m.call(T, 'desk', cls.id); m.call(A, 'desk', cls.id); m.call(B, 'desk', cls.id) }
  assert.equal(m.count.opens + m.count.nameReads + m.count.cellReads + m.count.spanReads, 0)
  m.resetCounts(); m.call(B, 'helpAsk', cls.id, WHERE, '')
  assert.ok(m.count.cellReads <= 3, 'read ' + m.count.cellReads)
})

test('idle: reported from the page, shown to the teacher, cleared on activity, forgotten after 5 minutes, never saved', () => {
  const { m, cls, ids } = setup()
  m.call(T, 'desk', cls.id)
  const rows = m.rows().length; m.resetCounts()
  m.call(A, 'idle', cls.id, true)
  assert.deepEqual(m.call(T, 'desk', cls.id).idle, [ids[A]])
  m.call(A, 'idle', cls.id, false)
  assert.deepEqual(m.call(T, 'desk', cls.id).idle, [])
  m.call(B, 'idle', cls.id, true); m.advance(4 * 60 * 1000)
  assert.deepEqual(m.call(T, 'desk', cls.id).idle, [ids[B]])
  m.advance(2 * 60 * 1000)
  assert.deepEqual(m.call(T, 'desk', cls.id).idle, [])
  assert.equal(m.rows().length, rows)
  assert.equal(m.count.writes + m.count.appends, 0)
  assert.throws(() => m.call('stranger@holliston.k12.ma.us', 'idle', cls.id, true), /not in this class/)
})
