// Inline a Vite build (one JS + one CSS file) into a single self-contained HTML page.
// Usage: node scripts/inline.mjs <distDir> <outFile>
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const [dist, out] = process.argv.slice(2)
const assets = join(dist, 'assets')
const files = readdirSync(assets)
const js = files.filter((f) => f.endsWith('.js'))
const css = files.filter((f) => f.endsWith('.css'))
if (js.length !== 1) throw new Error(`Expected one JS bundle, found ${js.length}: ${js.join(', ')}`)
const code = readFileSync(join(assets, js[0]), 'utf8').replaceAll('</script', '<\\/script')
const style = css.map((f) => readFileSync(join(assets, f), 'utf8')).join('\n').replace(/@import url\([^)]*\);?/g, '')
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AppVenture</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@500;700;800;900&display=swap">
<style>${style}</style>
</head>
<body>
<div id="root"></div>
<script type="module">${code}</script>
</body>
</html>
`
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, html)
console.log(`Wrote ${out} (${Math.round(html.length / 1024)} KB)`)
