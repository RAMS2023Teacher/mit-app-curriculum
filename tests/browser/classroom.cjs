const { chromium } = require('playwright')
const U = 'http://localhost:4300/'
;(async () => {
  const b = await chromium.launch(); const errs = []
  const open = async (email, h = '') => { const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); p.on('pageerror', (e) => errs.push(e.message)); await p.goto(U + '?as=' + encodeURIComponent(email) + (h ? '&h=' + encodeURIComponent(h) : '')); return p }
  const ok = async (name, fn) => { try { await fn(); console.log('OK  ', name) } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]) } }
  const cr = async () => (await fetch(U + '__classroom')).json()
  let cid = ''
  const t = await open('teacher@holliston.k12.ma.us')
  await ok('import course from Classroom', async () => {
    await t.getByPlaceholder('e.g. Ava R.').fill('Mr. P'); await t.getByRole('button', { name: /I'm a teacher/ }).click()
    await t.getByRole('button', { name: 'Choose a course' }).click(); await t.getByRole('button', { name: 'Import' }).click()
    await t.getByText('Students join at').waitFor(); cid = t.url().match(/class\/([^/?#]+)/)?.[1] ?? (await t.evaluate(() => location.hash.split('/')[2]))
    await t.getByRole('button', { name: /Students/ }).click(); await t.getByText('Ava R.').waitFor(); await t.getByText('Liam K.').waitFor()
  })
  await ok('create core assignments', async () => {
    await t.getByRole('button', { name: /Classroom/ }).click(); await t.getByRole('button', { name: 'Select core lessons' }).click()
    await t.getByRole('button', { name: /Create \d+ assignment/ }).click(); await t.getByText(/Created \d+ assignment/).waitFor()
    const s = await cr(); const first = Object.values(s.coursework)[0]
    if (Object.keys(s.coursework).length !== 7) throw new Error('count ' + Object.keys(s.coursework).length)
    if (!first.materials[0].link.url.includes('#/class/') || first.state !== 'DRAFT' || first.topicId !== 't1') throw new Error(JSON.stringify(first).slice(0, 200))
  })
  const a = await open('ava.r@holliston.k12.ma.us')
  await ok('imported student skips join + role', async () => { await a.getByText('Start your company').waitFor() })
  await ok('student works core-hello', async () => {
    await a.getByPlaceholder('e.g. Pixel Pirates').fill('Rocket Raccoons'); await a.getByRole('button', { name: /Found Rocket Raccoons/ }).click()
    await a.getByRole('link', { name: /PLAY|GO/ }).click(); await a.getByRole('button', { name: /Quiz/ }).first().click()
    for (let i = 0; i < 4; i++) { await a.locator('.quiz-opt').first().click(); await a.getByRole('button', { name: /Next ▶|See my score/ }).click() }
    await a.getByRole('button', { name: /Try again/ }).waitFor()
    await a.getByRole('button', { name: /Ship it/ }).click(); await a.locator('input[type=file]').setInputFiles(require('path').join(__dirname, '..', 'fixtures', 'TalkToMe.aia')); await a.getByText('checks passed').waitFor()
    await a.getByRole('button', { name: /Send to teacher/ }).click(); await a.getByText('Sent to your teacher').waitFor()
  })
  await ok('teacher approves + sends draft grades', async () => {
    await t.reload(); await t.getByRole('button', { name: /Review/ }).first().click(); await t.getByRole('button', { name: /Approve/ }).first().click(); await t.waitForTimeout(1500)
    await t.getByRole('button', { name: /Classroom/ }).click(); await t.getByRole('button', { name: /Send draft grades/ }).click(); await t.getByText(/Sent \d+ draft grade/).waitFor()
    const s = await cr(); console.log('     grades:', JSON.stringify(s.grades))
    const g = s.grades['cw1/g1']; if (!(g >= 70)) throw new Error('ava grade ' + g)
    if (s.grades['cw1/g2'] !== undefined) throw new Error('liam should be blank')
    await t.getByRole('button', { name: /Send draft grades/ }).click(); await t.getByText(/already up to date/).waitFor()
  })
  await ok('grades rescale when points change in Classroom', async () => {
    const was = (await cr()).grades['cw1/g1']
    await fetch(U + '__setmax?id=cw1&max=50')
    await t.getByRole('button', { name: /Send draft grades/ }).click(); await t.waitForTimeout(800)
    const s = await cr(); const want = Math.round(was * 0.5 * 10) / 10; if (s.grades['cw1/g1'] !== want) throw new Error('got ' + s.grades['cw1/g1'] + ', wanted ' + want)
  })
  await ok('assignment link opens the lesson', async () => {
    const p = await open('ava.r@holliston.k12.ma.us', `/class/${cid}/lesson/core-variables`)
    await p.getByRole('heading', { name: 'Variables' }).first().waitFor()
  })
  await ok('student cannot call Classroom', async () => {
    const r = await a.evaluate(() => fetch('/api', { method: 'POST', headers: { 'x-email': 'ava.r@holliston.k12.ma.us' }, body: JSON.stringify({ m: 'crListCourses', a: '[]' }) }).then((r) => r.json()))
    if (!r.error) throw new Error('allowed!')
  })
  console.log('errors', errs); await b.close()
})()
