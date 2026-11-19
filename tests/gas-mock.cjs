// A stand-in for Google Apps Script's services, so apps-script/Code.gs can run in Node.
// Failures can be switched on (mock.fail.*) and every storage call is counted (mock.count.*).
const fs = require('fs')
const vm = require('vm')
const path = require('path')
const crypto = require('crypto')

function createMock({ owner = 'teacher@holliston.k12.ma.us' } = {}) {
  const fail = { open: 0, props: 0, names: 0, cell: 0, write: 0, append: 0, lock: 0, copy: 0, fetch: 0 }
  const count = { creates: 0, opens: 0, nameReads: 0, cellReads: 0, spanReads: 0, writes: 0, appends: 0, deletes: 0, fetches: 0 }
  const state = { email: '', today: '2026-11-19', spreadsheets: {}, props: {}, cache: new Map(), nextId: 1 }
  const maybeFail = (k, what) => {
    if (fail[k] > 0) {
      fail[k]--
      throw new Error('Service error: ' + what)
    }
  }

  function makeSheet(ss, name, rows) {
    const sheet = {
      rows: rows || [],
      name,
      getName: () => sheet.name,
      setName: (n) => { sheet.name = n },
      setFrozenRows() {},
      getLastRow: () => { maybeFail('names', 'getLastRow'); return sheet.rows.length },
      getRange: (r, c, nr = 1, nc = 1) => ({
        getValues: () => {
          if (c === 1) { maybeFail('names', 'read names'); count.nameReads++ } else { maybeFail('cell', 'read cells'); nr > 1 ? count.spanReads++ : count.cellReads++ }
          return sheet.rows.slice(r - 1, r - 1 + nr).map((row) => row.slice(c - 1, c - 1 + nc))
        },
        getValue: () => { maybeFail('cell', 'read cell'); count.cellReads++; return sheet.rows[r - 1][c - 1] },
        setValues: (vals) => {
          maybeFail('write', 'write')
          count.writes++
          vals.forEach((v, i) => { const row = (sheet.rows[r - 1 + i] ||= []); v.forEach((x, j) => (row[c - 1 + j] = x)) })
        },
      }),
      appendRow: (row) => { maybeFail('append', 'append'); count.appends++; sheet.rows.push([...row]) },
      deleteRow: (r) => { maybeFail('write', 'delete'); count.deletes++; sheet.rows.splice(r - 1, 1) },
      copyTo: (dest) => { maybeFail('copy', 'copy'); const s = makeSheet(dest, 'Copy of ' + sheet.name, sheet.rows.map((r) => [...r])); dest.sheets.push(s); return s },
    }
    return sheet
  }
  function makeSpreadsheet(title) {
    const id = 'ss' + state.nextId++
    const ss = { id, title, sheets: [], getId: () => id, getSheets: () => [...ss.sheets], getSheetByName: (n) => ss.sheets.find((s) => s.name === n) || null, deleteSheet: (s) => { ss.sheets = ss.sheets.filter((x) => x !== s) } }
    ss.sheets.push(makeSheet(ss, 'Sheet1'))
    state.spreadsheets[id] = ss
    return ss
  }

  const cacheApi = {
    get: (k) => (state.cache.has(k) ? state.cache.get(k) : null),
    put: (k, v) => { state.cache.set(k, String(v)) },
    getAll: (keys) => Object.fromEntries(keys.filter((k) => state.cache.has(k)).map((k) => [k, state.cache.get(k)])),
    putAll: (o) => { for (const k in o) state.cache.set(k, String(o[k])) },
    remove: (k) => { state.cache.delete(k) },
  }
  const ctx = {
    console: { error() {}, log() {} },
    SpreadsheetApp: {
      create: (title) => { count.creates++; return makeSpreadsheet(title) },
      openById: (id) => { maybeFail('open', 'open spreadsheet'); count.opens++; const ss = state.spreadsheets[id]; if (!ss) throw new Error('No such spreadsheet ' + id); return ss },
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => { maybeFail('props', 'properties'); return state.props[k] ?? null }, setProperty: (k, v) => { state.props[k] = String(v) } }) },
    LockService: { getScriptLock: () => ({ waitLock() { maybeFail('lock', 'Lock timeout'); }, releaseLock() {} }) },
    CacheService: { getScriptCache: () => cacheApi },
    UrlFetchApp: {
      fetch: (url) => {
        maybeFail('fetch', 'fetch')
        count.fetches++
        const file = path.join(__dirname, '..', 'apps-script', url.split('/').pop())
        return { getResponseCode: () => 200, getContentText: () => fs.readFileSync(file, 'utf8') }
      },
    },
    Session: { getActiveUser: () => ({ getEmail: () => state.email }), getEffectiveUser: () => ({ getEmail: () => owner }), getScriptTimeZone: () => 'America/New_York' },
    ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/a/macros/holliston.k12.ma.us/s/XYZ/exec' }) },
    Utilities: {
      sleep() {},
      getUuid: () => crypto.randomUUID(),
      formatDate: () => state.today,
      DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (alg, s) => [...crypto.createHash('sha256').update(s).digest()],
      base64EncodeWebSafe: (bytes) => Buffer.from(bytes).toString('base64url'),
    },
  }
  vm.createContext(ctx)
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8'), ctx)

  const mock = {
    ctx, fail, count, state, owner,
    /** Call the server as `email`. Returns the parsed result or throws like Apps Script would. */
    call(email, method, ...args) {
      state.email = email
      const out = ctx.api(method, JSON.stringify(args))
      return out === undefined ? undefined : JSON.parse(out)
    },
    dataSheet() { const id = state.props.SHEET_ID; return id ? state.spreadsheets[id].getSheetByName('data') : null },
    rows() { return (mock.dataSheet()?.rows ?? []).slice(1) },
    row(pathName) { const r = mock.rows().find((x) => x[0] === pathName); return r ? r[1] : undefined },
    resetCounts() { for (const k in count) count[k] = 0 },
    clearCache() { state.cache.clear() },
  }
  return mock
}

module.exports = { createMock }
