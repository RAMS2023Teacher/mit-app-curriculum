// Keeps the Apps Script server in step with the app:
//  1. copies src/game/rules.js into apps-script/Code.gs (between the game-rules markers)
//  2. writes apps-script/manifest.json (lessons, answer keys, prices, badges) for the server to load
// Run with: npm run sync:server   (also runs as part of npm run build:appsscript)
import { readFileSync, writeFileSync } from 'node:fs'
import { buildManifest } from '../src/game/manifest.ts'

const START = '// <game-rules>'
const END = '// </game-rules>'
const rules = readFileSync('src/game/rules.js', 'utf8')
const names = [...rules.matchAll(/^export function (\w+)/gm)].map((m) => m[1])
const body = rules.replace(/^export /gm, '').trim()
const block = `${START} Generated from src/game/rules.js by \`npm run sync:server\`. Do not edit here.
var Game = (function () {
${body
  .split('\n')
  .map((l) => (l ? '  ' + l : l))
  .join('\n')}
  return { ${names.join(', ')} }
})()
${END}`

const path = 'apps-script/Code.gs'
const code = readFileSync(path, 'utf8')
const a = code.indexOf(START)
const b = code.indexOf(END)
if (a === -1 || b === -1) throw new Error('game-rules markers not found in ' + path)
writeFileSync(path, code.slice(0, a) + block + code.slice(b + END.length))
writeFileSync('apps-script/manifest.json', JSON.stringify(buildManifest()) + '\n')
console.log(`Synced ${names.length} rule functions into ${path} and wrote apps-script/manifest.json`)
