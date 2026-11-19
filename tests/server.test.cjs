// Reliability rules for the Apps Script server (apps-script/Code.gs).
// Run with: npm test
const test = require('node:test')
const assert = require('node:assert/strict')
const { createMock } = require('./gas-mock.cjs')

const T = 'teacher@holliston.k12.ma.us'
const S = (n) => `student${n}@holliston.k12.ma.us`
const BUSY = /Error: BUSY:/

/** A class with `n` students, each in their own company with one quiz result. */
function seed(m, n = 3) {
  m.call(T, 'me'); m.call(T, 'setName', 'Mr. P'); m.call(T, 'setRole', 'teacher')
  const cls = m.call(T, 'createClass', 'Period 1')
  const students = []
  for (let i = 0; i < n; i++) {
    const me = m.call(S(i), 'me'); m.call(S(i), 'setName', 'Kid ' + i); m.call(S(i), 'setRole', 'student')
    m.call(S(i), 'joinClass', cls.joinCode)
    const co = m.call(S(i), 'createCompany', cls.id, { name: 'Co ' + i, tagline: '', logo: {} })
    students.push({ email: S(i), uid: me.uid, co })
  }
  return { cls, students }
}
const snapshotOf = (m) => JSON.stringify([m.state.props.SHEET_ID, Object.keys(m.state.spreadsheets), m.rows()])

test('first visit creates one data sheet, and only one', () => {
  const m = createMock()
  m.call(T, 'me'); m.call(S(1), 'me')
  assert.equal(m.count.creates, 1)
  assert.ok(m.state.props.SHEET_ID)
  assert.match(m.state.props['storage:history'], new RegExp(m.state.props.SHEET_ID))
})

test('storage that fails to open never creates new storage or changes the saved id', () => {
  const m = createMock(); const { cls, students } = seed(m)
  const before = snapshotOf(m); m.clearCache(); m.resetCounts()
  m.fail.open = 99
  assert.throws(() => m.call(students[0].email, 'snapshot', cls.id), BUSY)
  assert.throws(() => m.call(students[0].email, 'recordQuiz', cls.id, students[0].co.id, 'core-hello', students[0].uid, { score: 4, total: 4 }), BUSY)
  assert.throws(() => m.call(T, 'me'), BUSY)
  m.fail.open = 0
  assert.equal(m.count.creates, 0)
  assert.equal(snapshotOf(m), before)
})

test('a failed read of the saved id is BUSY, not "no data yet"', () => {
  const m = createMock(); seed(m)
  const before = snapshotOf(m); m.resetCounts()
  m.fail.props = 99
  assert.throws(() => m.call(T, 'me'), BUSY)
  m.fail.props = 0
  assert.equal(m.count.creates, 0)
  assert.equal(snapshotOf(m), before)
})

test('a short hiccup is retried and the request succeeds', () => {
  const m = createMock(); const { cls, students } = seed(m)
  m.clearCache(); m.fail.open = 2; m.fail.names = 1; m.fail.cell = 2
  const snap = m.call(students[0].email, 'snapshot', cls.id)
  assert.equal(snap.members.length, 3)
})

test('reads that keep failing stop the request and overwrite nothing', () => {
  const m = createMock(); const { cls, students } = seed(m)
  const before = snapshotOf(m); m.resetCounts()
  for (const k of ['names', 'cell']) {
    m.fail[k] = 99
    assert.throws(() => m.call(students[1].email, 'recordQuiz', cls.id, students[1].co.id, 'core-hello', students[1].uid, { score: 4, total: 4 }), BUSY)
    assert.throws(() => m.call(students[1].email, 'me'), BUSY)
    m.fail[k] = 0
  }
  assert.equal(m.count.writes + m.count.appends + m.count.deletes, 0)
  assert.equal(snapshotOf(m), before)
})

test('a student who already has a record is never given a blank one', () => {
  const m = createMock(); const { students } = seed(m)
  const saved = m.row('users/' + students[0].uid)
  m.fail.cell = 99
  assert.throws(() => m.call(students[0].email, 'me'), BUSY)
  m.fail.cell = 0
  assert.equal(m.row('users/' + students[0].uid), saved)
  assert.equal(m.call(students[0].email, 'me').name, 'Kid 0')
})

test('a failed save never adds a second row and never moves the saved id', () => {
  const m = createMock(); const { cls, students } = seed(m)
  const id = m.state.props.SHEET_ID; const n = m.rows().length
  m.fail.write = 99
  assert.throws(() => m.call(students[0].email, 'recordQuiz', cls.id, students[0].co.id, 'core-hello', students[0].uid, { score: 4, total: 4 }), BUSY)
  m.fail.write = 0; m.fail.append = 1
  assert.throws(() => m.call(students[0].email, 'submit', cls.id, students[0].co.id, { rid: 'abcdefgh12', lessonId: 'core-hello', link: 'x', notes: '' }), BUSY)
  assert.equal(m.rows().length, n)
  assert.equal(m.state.props.SHEET_ID, id)
  // The page retries with the same id: exactly one submission exists afterwards.
  m.call(students[0].email, 'submit', cls.id, students[0].co.id, { rid: 'abcdefgh12', lessonId: 'core-hello', link: 'x', notes: '' })
  m.call(students[0].email, 'submit', cls.id, students[0].co.id, { rid: 'abcdefgh12', lessonId: 'core-hello', link: 'x', notes: '' })
  assert.equal(m.rows().filter((r) => r[0].startsWith('submissions/')).length, 1)
  const paths = m.rows().map((r) => r[0]); assert.equal(new Set(paths).size, paths.length)
})

test('damaged data is an error, never an empty record, and is not overwritten', () => {
  const m = createMock(); const { cls, students } = seed(m)
  const row = m.dataSheet().rows.find((r) => r[0] === 'companies/' + cls.id + '/' + students[0].co.id)
  row[1] = '{"name": "Co 0", broken'
  m.clearCache()
  assert.throws(() => m.call(students[0].email, 'recordQuiz', cls.id, students[0].co.id, 'core-hello', students[0].uid, { score: 4, total: 4 }), /Error: DAMAGED:/)
  assert.throws(() => m.call(students[0].email, 'updateCompany', cls.id, students[0].co.id, { name: 'New' }), /Error: DAMAGED:/)
  assert.throws(() => m.call(students[0].email, 'snapshot', cls.id), /Error: DAMAGED:/)
  assert.equal(row[1], '{"name": "Co 0", broken')
})

test('a busy lock is BUSY and changes nothing', () => {
  const m = createMock(); const { cls, students } = seed(m)
  const before = snapshotOf(m)
  m.fail.lock = 1
  assert.throws(() => m.call(students[0].email, 'updateCompany', cls.id, students[0].co.id, { name: 'New' }), BUSY)
  assert.equal(snapshotOf(m), before)
})

test('one student click reads at most 3 records with 300 other students present', () => {
  const m = createMock(); const { cls, students } = seed(m, 300)
  const s = students[7]
  for (const [method, ...args] of [
    ['recordQuiz', cls.id, s.co.id, 'core-hello', s.uid, { score: 3, total: 4 }],
    ['chooseBranch', cls.id, s.co.id, 'mini', 'mini-quiz'],
    ['updateCompany', cls.id, s.co.id, { tagline: 'hi' }],
    ['submit', cls.id, s.co.id, { lessonId: 'core-hello', link: 'x', notes: '' }],
    ['me'],
  ]) {
    m.resetCounts()
    m.call(s.email, method, ...args)
    assert.ok(m.count.cellReads <= 3, `${method} read ${m.count.cellReads} records`)
    assert.equal(m.count.spanReads, 0, `${method} read the whole sheet`)
  }
})

test('20 students opening the same page rebuild the class summary once', () => {
  const m = createMock(); const { cls, students } = seed(m, 20)
  m.clearCache(); m.resetCounts()
  for (const s of students) assert.equal(m.call(s.email, 'snapshot', cls.id).members.length, 20)
  assert.equal(m.count.spanReads, 1)
  assert.equal(m.count.cellReads, 0)
})

test('the summary is fresh after a save, and students never get emails or other companies\' submissions', () => {
  const m = createMock(); const { cls, students } = seed(m)
  m.call(students[0].email, 'snapshot', cls.id)
  m.call(students[0].email, 'updateCompany', cls.id, students[0].co.id, { name: 'Renamed' })
  m.call(students[1].email, 'submit', cls.id, students[1].co.id, { lessonId: 'core-hello', link: 'x', notes: '' })
  const snap = m.call(students[0].email, 'snapshot', cls.id)
  assert.ok(snap.companies.some((c) => c.name === 'Renamed'))
  assert.equal(snap.submissions.length, 0)
  assert.ok(!JSON.stringify(snap).includes('@'))
  const t = m.call(T, 'snapshot', cls.id)
  assert.equal(t.submissions.length, 1)
  assert.ok(t.members.every((x) => x.email))
})

test('backups: one per day, 8 kept, "Back up now" redoes today\'s', () => {
  const m = createMock(); const { cls, students } = seed(m)
  const backups = () => m.state.spreadsheets[m.state.props.BACKUP_ID].sheets.map((s) => s.name).sort()
  m.call(T, 'myClasses'); m.call(T, 'myClasses'); m.call(T, 'snapshot', cls.id)
  assert.deepEqual(backups(), ['2026-11-19'])
  assert.equal(Object.keys(m.state.spreadsheets).length, 2)
  // Students never trigger a backup.
  m.state.today = '2026-11-20'; m.call(students[0].email, 'snapshot', cls.id); m.call(students[0].email, 'myClasses')
  assert.deepEqual(backups(), ['2026-11-19'])
  for (let d = 20; d <= 30; d++) { m.state.today = '2026-11-' + d; m.call(T, 'myClasses') }
  assert.equal(backups().length, 8)
  assert.equal(backups()[0], '2026-11-23'); assert.equal(backups()[7], '2026-11-30')
  // Back up now replaces today's with the newest data.
  m.call(students[0].email, 'updateCompany', cls.id, students[0].co.id, { name: 'After backup' })
  const info = m.call(T, 'backupNow')
  assert.equal(info.lastBackup, '2026-11-30'); assert.equal(info.backups.length, 8); assert.equal(info.students, 3); assert.equal(info.classes, 1)
  const todays = m.state.spreadsheets[m.state.props.BACKUP_ID].getSheetByName('2026-11-30')
  assert.ok(JSON.stringify(todays.rows).includes('After backup'))
  // The backup holds every record.
  assert.equal(todays.rows.length, m.dataSheet().rows.length)
})

test('a failing backup never breaks the teacher\'s page or touches the data', () => {
  const m = createMock(); seed(m)
  const before = JSON.stringify(m.rows())
  m.fail.copy = 99
  assert.equal(m.call(T, 'myClasses').length, 1)
  assert.equal(JSON.stringify(m.rows()), before)
})

test('only teachers can see data info or make backups', () => {
  const m = createMock(); const { students } = seed(m)
  assert.throws(() => m.call(students[0].email, 'dataInfo'), /Only teachers/)
  assert.throws(() => m.call(students[0].email, 'backupNow'), /Only teachers/)
})
