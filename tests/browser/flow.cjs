const { chromium } = require('playwright')
const U = 'http://localhost:4300/'
;(async () => {
  const b = await chromium.launch()
  const errs = []
  const open = async (email) => { const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); p.on('pageerror', (e) => errs.push(email + ': ' + e.message)); await p.goto(U + '?as=' + encodeURIComponent(email)); return p }
  const ok = async (name, fn) => { try { await fn(); console.log('OK  ', name) } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]) } }

  const t = await open('teacher@holliston.k12.ma.us')
  let code = ''
  await ok('teacher sets name + role + creates class', async () => {
    await t.getByPlaceholder('e.g. Ava R.').fill('Mr. P')
    await t.getByRole('button', { name: /I'm a teacher/ }).click()
    await t.getByText('My classes').first().waitFor()
    await t.getByPlaceholder(/Period 4/).fill('Period 2 · Apps')
    await t.getByRole('button', { name: 'Create class' }).click()
    await t.getByText('Students join at').waitFor()
    code = (await t.locator('div', { hasText: /^[A-Z0-9]{6}$/ }).first().innerText()).trim()
    if (!/^[A-Z0-9]{6}$/.test(code)) throw new Error('no code: ' + code)
  })

  const a = await open('ava.r@holliston.k12.ma.us')
  await ok('student cannot pick teacher role', async () => {
    await a.getByPlaceholder('e.g. Ava R.').fill('Ava R.')
    await a.getByRole('button', { name: /I'm a teacher/ }).click()
    await a.getByText(/Only teachers can choose/).waitFor()
  })
  await ok('student joins + founds company', async () => {
    await a.getByRole('button', { name: /I'm a student/ }).click()
    await a.getByLabel('Class code').fill(code)
    await a.getByRole('button', { name: 'Join class' }).click()
    await a.getByPlaceholder('e.g. Pixel Pirates').fill('Rocket Raccoons')
    await a.getByRole('button', { name: /Found Rocket Raccoons/ }).click()
    await a.getByText('NEXT MISSION').waitFor()
  })
  await ok('student quiz + submit', async () => {
    await a.getByRole('link', { name: /PLAY|GO/ }).click()
    await a.getByRole('button', { name: /Quiz/ }).first().click()
    for (let i = 0; i < 4; i++) {
      const opts = a.locator('.quiz-opt'); const n = await opts.count()
      // pick the right answer by trying options until marked right
      await opts.first().click(); await a.getByRole('button', { name: /Next ▶|See my score/ }).click()
    }
    await a.getByRole('button', { name: /Try again/ }).waitFor()
    await a.getByRole('button', { name: /Ship it/ }).click()
    await a.locator('input[type=file]').setInputFiles(require('path').join(__dirname, '..', 'fixtures', 'TalkToMe.aia'))
    await a.getByText('checks passed').waitFor()
    await a.getByRole('button', { name: /Send to teacher/ }).click()
    await a.getByText('Sent to your teacher').waitFor()
  })
  const outsider = await open('someone@gmail.com')
  await ok('outside account blocked', async () => { await outsider.getByText(/Please use your @holliston.k12.ma.us account/).waitFor() })

  await ok('teacher sees + approves submission', async () => {
    await t.reload(); await t.getByRole('button', { name: /Review/ }).first().click()
    await t.getByText('by Ava R.').waitFor()
    await t.getByRole('button', { name: /Approve/ }).first().click()
    await t.waitForTimeout(1500)
    await t.getByRole('button', { name: /Students/ }).click(); await t.getByText('ava.r@holliston.k12.ma.us').waitFor()
  })
  await ok('student sees approval', async () => {
    await a.goto(U + '?as=ava.r%40holliston.k12.ma.us'); await a.getByText('NEXT MISSION').waitFor(); await a.waitForTimeout(500)
    await a.getByRole('link', { name: 'Tree' }).click(); await a.locator('.tree-svg').waitFor()
  })
  await ok('student cannot approve own plan / read others', async () => {
    const r = await a.evaluate(async () => {
      const call = (m, ...args) => fetch('/api', { method: 'POST', headers: { 'x-email': 'ava.r@holliston.k12.ma.us' }, body: JSON.stringify({ m, a: JSON.stringify(args) }) }).then((r) => r.json())
      const classes = JSON.parse((await call('myClasses')).result)
      const snap = JSON.parse((await call('snapshot', classes[0].id)).result)
      const co = snap.companies[0]
      await call('savePlan', classes[0].id, co.id, 'games-capstone', { idea: 'x', pitch: '', must: ['a'], nice: [], roles: {}, approved: true, feedback: 'self' })
      const after = JSON.parse((await call('snapshot', classes[0].id)).result)
      const rev = await call('review', classes[0].id, snap.submissions[0].id, { status: 'approved', feedback: '', bonusApproved: true }, false)
      return { approved: after.companies[0].plans['games-capstone'].approved, feedback: after.companies[0].plans['games-capstone'].feedback, reviewErr: rev.error, memberHasEmail: after.members.some((m) => m.email) }
    })
    if (r.approved || r.feedback || !r.reviewErr || r.memberHasEmail) throw new Error(JSON.stringify(r))
  })
  await ok('sheet: emails only in users rows', async () => {
    const rows = await (await fetch(U + '__sheet')).json()
    const leaks = rows.filter((r) => String(r[1]).includes('@holliston') && !String(r[0]).startsWith('users/')).map((r) => r[0])
    if (leaks.length) throw new Error('email in ' + leaks.join(', '))
    console.log('     rows:', rows.slice(1).map((r) => r[0]).join(' | '))
  })
  console.log('errors', errs)
  await b.close()
})()
