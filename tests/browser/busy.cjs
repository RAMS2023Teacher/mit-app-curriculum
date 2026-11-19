// Browser test: the server turns away 3 requests while a student saves.
// The busy note shows, no error appears, and the save lands.
// Needs Playwright:  npm run build:appsscript && node tests/dev-server.cjs &  then  node tests/browser/busy.cjs
const { chromium } = require('playwright')
const U = process.env.URL || 'http://localhost:4300/'
const T = 'teacher@holliston.k12.ma.us'
const A = 'ava.r@holliston.k12.ma.us'

;(async () => {
  const b = await chromium.launch()
  const errors = []
  const open = async (email) => { const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage(); p.on('pageerror', (e) => errors.push(e.message)); await p.goto(U + '?as=' + encodeURIComponent(email)); return p }
  let failed = 0
  const check = (name, ok, extra = '') => { console.log((ok ? 'OK   ' : 'FAIL ') + name + (ok ? '' : ' ' + extra)); if (!ok) failed++ }

  const t = await open(T)
  await t.getByPlaceholder('e.g. Ava R.').fill('Mr. P'); await t.getByRole('button', { name: /I'm a teacher/ }).click()
  await t.getByPlaceholder(/Period 4/).fill('Period 2'); await t.getByRole('button', { name: 'Create class' }).click()
  await t.getByText('Students join at').waitFor()
  const code = (await t.locator('div', { hasText: /^[A-Z0-9]{6}$/ }).first().innerText()).trim()

  const a = await open(A)
  await a.getByPlaceholder('e.g. Ava R.').fill('Ava R.'); await a.getByRole('button', { name: /I'm a student/ }).click()
  await a.getByLabel('Class code').fill(code); await a.getByRole('button', { name: 'Join class' }).click()
  await a.getByPlaceholder('e.g. Pixel Pirates').fill('Rocket Raccoons'); await a.getByRole('button', { name: /Found Rocket Raccoons/ }).click()
  await a.getByText('NEXT MISSION').waitFor()

  // The student takes the quiz while the server turns away the next 3 saves.
  await a.getByRole('link', { name: /PLAY|GO/ }).click(); await a.getByRole('button', { name: /Quiz/ }).first().click()
  for (let i = 0; i < 4; i++) {
    await a.locator('.quiz-opt').first().click()
    if (i === 3) await fetch(U + '__busy?n=3')
    await a.getByRole('button', { name: /Next ▶|See my score/ }).click()
  }
  await a.locator('.busy-note').waitFor({ timeout: 5000 }).then(() => check('busy note shows', true), () => check('busy note shows', false))
  await a.getByRole('button', { name: /Try again/ }).waitFor({ timeout: 40000 })
  check('no error shown to the student', (await a.locator('.error').count()) === 0)
  check('busy note goes away', (await a.locator('.busy-note').count()) === 0)
  const served = (await (await fetch(U + '__busyServed')).json()).busyServed
  check('server turned away 3 requests', served === 3, 'got ' + served)
  const rows = await (await fetch(U + '__sheet')).json()
  const co = rows.find((r) => String(r[0]).startsWith('companies/'))
  check('the quiz result is saved', !!co && /"core-hello":\{"u/.test(co[1]), co && co[1].slice(0, 200))

  // Too busy to even load: a kind message, then it recovers by itself.
  await fetch(U + '__busy?n=0')
  check('no page errors', errors.length === 0, errors.join('; '))
  await b.close()
  process.exit(failed ? 1 : 0)
})()
