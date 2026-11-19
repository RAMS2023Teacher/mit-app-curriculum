const { chromium } = require('playwright')
// Runs against the demo build:  npm run build && npx vite preview --port 4173   then   node tests/browser/help-demo.cjs
const D = process.argv[2] || require('os').tmpdir(), U = process.env.URL || 'http://localhost:4173/'
;(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } })
  await ctx.addInitScript(() => { window.__NUDGE = { first: 1500, second: 4000, away: 500, back: 500, fade: 1500, report: 60000 } })
  const p = await ctx.newPage(); const errs = []
  p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  const ok = async (name, fn) => { try { await fn(); console.log('OK  ', name) } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]); await p.screenshot({ path: `${D}/fail-${name.replace(/\W+/g, '_')}.png` }) } }
  const as = async (uid, hash) => { await p.goto(U); await p.evaluate((u) => localStorage.setItem('appventure-demo-user', u), uid); await p.goto('about:blank'); await p.goto(U + hash) }
  await p.goto(U); await p.evaluate(() => localStorage.clear())
  await as('s-sam', '#/class/demo-class')
  await ok('idle hint on dashboard points at the mission button', async () => {
    await p.getByText('NEXT MISSION').waitFor(); await p.locator('.nudge-bubble').waitFor({ timeout: 6000 })
    const t = await p.locator('.nudge-bubble').innerText(); if (!/Start your next mission/.test(t)) throw new Error(t)
    if (!(await p.locator('a.nudge-glow').count())) throw new Error('no glow'); await p.screenshot({ path: D + '/1-hint.png' })
  })
  await ok('a key press clears the hint at once', async () => { await p.keyboard.press('Shift'); await p.waitForTimeout(150); if (await p.locator('.nudge-bubble').count()) throw new Error('still there') })
  await ok('2 minutes: stronger hint points at help button too, and reports idle', async () => {
    await p.goto(U + '#/class/demo-class/lesson/core-conditionals'); await p.getByRole('button', { name: /Build/ }).first().click()
    await p.locator('.nudge-strong').waitFor({ timeout: 9000 }); await p.locator('#help-button.nudge-glow').waitFor()
    const t = await p.locator('.nudge-bubble').innerText(); if (!/Still stuck\? Press ✋/.test(t)) throw new Error(t)
    await p.screenshot({ path: D + '/2-strong.png' })
    const idle = await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('appventure-demo-db')).idle['demo-class']))
    if (!idle.includes('s-sam')) throw new Error('not reported: ' + idle)
  })
  await ok('acting reports back', async () => {
    await p.mouse.click(600, 200); await p.waitForTimeout(400)
    const idle = await p.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('appventure-demo-db')).idle['demo-class']))
    if (idle.includes('s-sam')) throw new Error('still idle')
  })
  await ok('student asks for help', async () => {
    await p.locator('#help-button').click(); await p.getByPlaceholder(/My button does nothing/).fill('The if block will not snap in')
    await p.getByRole('button', { name: /Ask my teacher/ }).click(); await p.getByText('Help is on the way!').waitFor(); await p.locator('.help-box').screenshot({ path: D + '/3-waiting.png' })
  })
  await as('demo-teacher', '#/class/demo-class/screen')
  await ok('class screen lists requests with place and note', async () => {
    await p.getByText('Needs help').waitFor(); await p.getByText('2 need help').waitFor(); await p.getByText('The if block will not snap in').waitFor()
    await p.getByText(/Conditionals · Step/).waitFor(); await p.getByText(/💤 1 idle/).waitFor()
    await p.screenshot({ path: D + '/4-screen.png' })
  })
  await ok('teacher marks helped', async () => {
    await p.locator('.help-row-item', { hasText: 'Sam' }).getByRole('button', { name: /Helped/ }).click(); await p.getByText('1 needs help').waitFor()
  })
  await as('s-sam', '#/class/demo-class/lesson/core-conditionals')
  await ok('student box resets', async () => { await p.locator('#help-button').waitFor() })
  console.log('errors', errs); await b.close()
})()
