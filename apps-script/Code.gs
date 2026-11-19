/**
 * AppVenture: Google Apps Script server.
 *
 * Runs as a web app in YOUR school Google account. All class data is stored in a
 * Google Sheet in your Drive ("AppVenture Data", created on first use), so it stays
 * inside your district's Google Workspace.
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me        Who has access: Anyone within <your district>
 *
 * What is stored about students: their school email (only in the "users" rows, which
 * only you can see), the display name they type, and their class progress. Nothing else.
 *
 * Google Classroom: to import classes and create assignments, add the service in the
 * editor: Services (+) → Google Classroom API → Add. Then deploy a new version.
 */

// Where the app's page is loaded from. Updates you push to GitHub show up automatically.
var BUNDLE_URL = 'https://raw.githubusercontent.com/RAMS2023Teacher/mit-app-curriculum/main/apps-script/index.html'

// Optional: only allow accounts on this domain (the deployment setting already does this).
var ALLOWED_DOMAIN = 'holliston.k12.ma.us'

// ---------------------------------------------------------------- web app entry

function doGet() {
  var html = loadBundle_()
  return HtmlService.createHtmlOutput(html)
    .setTitle('AppVenture')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}

function loadBundle_() {
  var cache = CacheService.getScriptCache()
  var count = cache.get('bundle:n')
  if (count) {
    var keys = []
    for (var i = 0; i < Number(count); i++) keys.push('bundle:' + i)
    var parts = cache.getAll(keys)
    if (Object.keys(parts).length === keys.length) return keys.map(function (k) { return parts[k] }).join('')
  }
  var res = UrlFetchApp.fetch(BUNDLE_URL, { muteHttpExceptions: true })
  if (res.getResponseCode() !== 200) throw new Error('Could not load the app from ' + BUNDLE_URL + ' (HTTP ' + res.getResponseCode() + ')')
  var text = res.getContentText()
  var size = 90000
  var out = {}
  var n = Math.ceil(text.length / size)
  for (var j = 0; j < n; j++) out['bundle:' + j] = text.slice(j * size, (j + 1) * size)
  out['bundle:n'] = String(n)
  cache.putAll(out, 600) // 10 minutes
  return text
}

/** Run this from the editor after pushing an update to see it right away. */
function clearAppCache() {
  CacheService.getScriptCache().remove('bundle:n')
}

// ---------------------------------------------------------------- storage
//
// Rules (see tests/server.test.cjs, which checks every one of these):
//  - An error is never "missing". Reads are tried up to 4 times; if they still fail the
//    request stops with a BUSY error. Nothing is created or overwritten.
//  - Storage is created only when no id was ever saved, inside a lock, re-checking inside it.
//  - A row that does not parse is an error (DAMAGED), never an empty record, and is never overwritten.
//  - A failed save never adds a second row for the same record.
//  - Every storage id ever used is remembered in the "storage:history" script property.

var SHEET_NAME = 'data'
var BUSY_MSG = 'BUSY: The app is very busy right now. Your work is safe.'

function props_() {
  return PropertiesService.getScriptProperties()
}

function busy_(cause) {
  if (cause) console.error(cause)
  return new Error(BUSY_MSG)
}

/** Try up to 4 times with growing waits; then give up with BUSY (never with an empty value). */
function retry_(fn) {
  var last
  for (var i = 0; i < 4; i++) {
    try {
      return fn()
    } catch (e) {
      last = e
      if (i < 3) Utilities.sleep(150 * Math.pow(2, i))
    }
  }
  throw busy_(last)
}

function remember_(key, id) {
  var props = props_()
  var hist = JSON.parse(props.getProperty('storage:history') || '[]')
  if (!hist.some(function (h) { return h.key === key && h.id === id })) {
    hist.push({ key: key, id: id, at: Date.now() })
    props.setProperty('storage:history', JSON.stringify(hist))
  }
}

/** Reads a saved id. A failed read throws BUSY; only a real "never saved" returns null. */
function savedId_(key) {
  return retry_(function () {
    return props_().getProperty(key)
  })
}

/** Makes a spreadsheet for `key` only if no id was ever saved for it. Must not be called while holding the lock. */
function createOnce_(key, title, setup) {
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(20000)
  } catch (e) {
    throw busy_(e)
  }
  try {
    var id = props_().getProperty(key) // re-check inside the lock
    if (id) return id
    var ss = SpreadsheetApp.create(title)
    if (setup) setup(ss)
    props_().setProperty(key, ss.getId())
    remember_(key, ss.getId())
    return ss.getId()
  } finally {
    lock.releaseLock()
  }
}

function sheet_() {
  var id = savedId_('SHEET_ID')
  if (!id) {
    id = createOnce_('SHEET_ID', 'AppVenture Data', function (ss) {
      var sh0 = ss.getSheets()[0]
      sh0.setName(SHEET_NAME)
      sh0.getRange(1, 1, 1, 3).setValues([['path', 'json', 'updated']])
      sh0.setFrozenRows(1)
    })
  }
  // The id exists, so the data exists. If it can't be opened right now, stop: never make a new one.
  return retry_(function () {
    var sh = SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME)
    if (!sh) throw new Error('The "data" tab is missing from the AppVenture Data sheet.')
    return sh
  })
}

/**
 * One request's view of the data. Reads only the rows it is asked for:
 * the list of record names (column A) once, then one cell per record.
 */
function Store_() {
  var sh = sheet_()
  var rowOf = null
  var memo = {}
  var touched = []

  function index() {
    if (rowOf) return rowOf
    var last = retry_(function () { return sh.getLastRow() })
    var names = last > 1 ? retry_(function () { return sh.getRange(2, 1, last - 1, 1).getValues() }) : []
    rowOf = {}
    for (var i = 0; i < names.length; i++) if (names[i][0] && !rowOf[names[i][0]]) rowOf[names[i][0]] = i + 2
    return rowOf
  }
  function parse(path, raw) {
    try {
      var v = JSON.parse(raw)
      if (v === null || typeof v !== 'object') throw new Error('not an object')
      return v
    } catch (e) {
      throw new Error('DAMAGED: The saved data for "' + path + '" could not be read. Nothing was changed. Please tell your teacher.')
    }
  }
  function read(path) {
    if (Object.prototype.hasOwnProperty.call(memo, path)) return memo[path]
    var r = index()[path]
    if (!r) return (memo[path] = null) // the name list was read successfully, so this record really doesn't exist
    var raw = retry_(function () { return sh.getRange(r, 2, 1, 1).getValue() })
    return (memo[path] = parse(path, raw))
  }
  /** Read many records with one call when there are a lot of them. */
  function readMany(paths) {
    var need = paths.filter(function (p) { return !Object.prototype.hasOwnProperty.call(memo, p) && index()[p] })
    if (need.length > 6) {
      var rows = need.map(function (p) { return index()[p] })
      var lo = Math.min.apply(null, rows)
      var hi = Math.max.apply(null, rows)
      var vals = retry_(function () { return sh.getRange(lo, 2, hi - lo + 1, 1).getValues() })
      need.forEach(function (p) { memo[p] = parse(p, vals[index()[p] - lo][0]) })
    }
    return paths.map(read)
  }
  var clone = function (v) { return v ? JSON.parse(JSON.stringify(v)) : null }

  return {
    touched: touched,
    get: function (path) {
      return clone(read(path))
    },
    list: function (prefix) {
      var paths = Object.keys(index()).filter(function (p) { return p.indexOf(prefix) === 0 && p.slice(prefix.length).indexOf('/') === -1 })
      return readMany(paths).map(clone)
    },
    /** Record names only (no record contents are read). */
    names: function () {
      return Object.keys(index())
    },
    /** Load every record with one read (used to build the class summary). */
    loadAll: function () {
      readMany(Object.keys(index()))
    },
    set: function (path, obj) {
      var json = JSON.stringify(obj)
      if (json.length > 45000) throw new Error('That is too much data to save at once.')
      var r = index()[path]
      if (r) {
        read(path) // refuses to overwrite a damaged record
        retry_(function () { sh.getRange(r, 2, 1, 2).setValues([[json, new Date()]]) })
      } else {
        // Not retried: if a failed append did save, trying again would add a second row.
        try {
          sh.appendRow([path, json, new Date()])
        } catch (e) {
          throw busy_(e)
        }
        rowOf[path] = retry_(function () { return sh.getLastRow() })
      }
      memo[path] = JSON.parse(json)
      touched.push(path)
    },
    del: function (path) {
      var r = index()[path]
      if (!r) return
      retry_(function () { sh.deleteRow(r) })
      delete rowOf[path]
      memo[path] = null
      for (var p in rowOf) if (rowOf[p] > r) rowOf[p]--
      touched.push(path)
    },
  }
}

/** Run a change while holding the lock, with a fresh view of the data. Never call this while already holding it. */
function withLock_(fn) {
  var lock = LockService.getScriptLock()
  try {
    lock.waitLock(12000)
  } catch (e) {
    throw busy_(e)
  }
  try {
    var db = Store_()
    var out = fn(db)
    invalidate_(db.touched)
    return out
  } finally {
    lock.releaseLock()
  }
}

// ---- class summary cache: one build serves everyone in the class for up to a minute

function bigGet_(key) {
  var cache = CacheService.getScriptCache()
  var n = cache.get(key + ':n')
  if (!n) return null
  var keys = []
  for (var i = 0; i < Number(n); i++) keys.push(key + ':' + i)
  var parts = cache.getAll(keys)
  if (Object.keys(parts).length !== keys.length) return null
  return keys.map(function (k) { return parts[k] }).join('')
}
function bigPut_(key, text, seconds) {
  var size = 90000
  var out = {}
  var n = Math.ceil(text.length / size)
  if (n > 40) return // too big to cache; just rebuild each time
  for (var j = 0; j < n; j++) out[key + ':' + j] = text.slice(j * size, (j + 1) * size)
  out[key + ':n'] = String(n)
  CacheService.getScriptCache().putAll(out, seconds)
}

/** Everything in one class: { cls, members, companies, submissions, approvals, emails }. */
function classBundle_(cid) {
  var cache = CacheService.getScriptCache()
  var hit = bigGet_('cb:' + cid)
  if (hit) return JSON.parse(hit)
  // Someone else is already building it: wait a moment for theirs instead of building a second one.
  for (var i = 0; i < 16 && cache.get('cbb:' + cid); i++) {
    Utilities.sleep(250)
    hit = bigGet_('cb:' + cid)
    if (hit) return JSON.parse(hit)
  }
  cache.put('cbb:' + cid, '1', 20)
  try {
    var ver = cache.get('cbv:' + cid) || '0'
    var db = Store_()
    db.loadAll()
    var b = {
      cls: db.get('classes/' + cid),
      members: db.list('members/' + cid + '/'),
      companies: db.list('companies/' + cid + '/'),
      submissions: db.list('submissions/' + cid + '/'),
      approvals: db.list('approvals/' + cid + '/'),
      emails: {},
    }
    b.members.forEach(function (m) {
      var u = db.get('users/' + m.uid)
      if (u) b.emails[m.uid] = u.email
    })
    // Only keep it if nothing changed while we were reading.
    if ((cache.get('cbv:' + cid) || '0') === ver) bigPut_('cb:' + cid, JSON.stringify(b), 60)
    return b
  } finally {
    cache.remove('cbb:' + cid)
  }
}

/** After a save, drop the cached summary of every class that was changed. */
function invalidate_(paths) {
  var seen = {}
  var cache = CacheService.getScriptCache()
  paths.forEach(function (p) {
    var parts = p.split('/')
    var cid = parts[0] === 'classes' ? parts[1] : /^(members|companies|submissions|approvals)$/.test(parts[0]) ? parts[1] : null
    if (!cid || seen[cid]) return
    seen[cid] = 1
    cache.put('cbv:' + cid, String(Date.now()) + ':' + Math.random(), 21600)
    cache.remove('cb:' + cid + ':n')
  })
}

// ---------------------------------------------------------------- backups
//
// Once a day the whole data tab is copied into a dated tab of a second spreadsheet,
// "AppVenture Backups". The last 8 days are kept. It runs while the teacher uses the app.

var BACKUPS_KEPT = 8

function today_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd')
}

function backup_(force) {
  var props = props_()
  var today = today_()
  if (!force && props.getProperty('backup:last') === today) return false
  var cache = CacheService.getScriptCache()
  if (!force && cache.get('backup:running')) return false
  cache.put('backup:running', '1', 120)
  try {
    var src = sheet_()
    var bid = savedId_('BACKUP_ID') || createOnce_('BACKUP_ID', 'AppVenture Backups', null)
    var bss = retry_(function () { return SpreadsheetApp.openById(bid) })
    var old = bss.getSheetByName(today)
    var copy = src.copyTo(bss) // copy first, so today's old backup is only removed once the new one exists
    if (old) bss.deleteSheet(old)
    copy.setName(today)
    var dated = bss.getSheets().filter(function (sh) { return /^\d{4}-\d{2}-\d{2}$/.test(sh.getName()) })
    dated.sort(function (a, b) { return a.getName() < b.getName() ? -1 : 1 })
    while (dated.length > BACKUPS_KEPT) bss.deleteSheet(dated.shift())
    bss.getSheets().forEach(function (sh) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(sh.getName()) && bss.getSheets().length > 1) bss.deleteSheet(sh)
    })
    props.setProperty('backup:last', today)
    props.setProperty('backup:at', String(Date.now()))
    return true
  } finally {
    cache.remove('backup:running')
  }
}

/** Called from teacher pages. A backup problem must never break the teacher's page. */
function backupTick_() {
  try {
    backup_(false)
  } catch (e) {
    console.error(e)
  }
}

// ---------------------------------------------------------------- identity

function email_() {
  var e = (Session.getActiveUser().getEmail() || '').toLowerCase()
  if (!e) throw new Error('Please sign in with your school Google account to use AppVenture.')
  if (ALLOWED_DOMAIN && e.slice(-ALLOWED_DOMAIN.length - 1) !== '@' + ALLOWED_DOMAIN) throw new Error('Please use your @' + ALLOWED_DOMAIN + ' account.')
  return e
}

/** Short, stable ID per person so emails never appear in class data. */
function uidFor_(email) {
  var salt = savedId_('SALT')
  if (!salt) {
    // First ever visit. Two people arriving together must end up with the same salt.
    var lock = LockService.getScriptLock()
    try {
      lock.waitLock(20000)
    } catch (e) {
      throw busy_(e)
    }
    try {
      salt = props_().getProperty('SALT')
      if (!salt) {
        salt = Utilities.getUuid()
        props_().setProperty('SALT', salt)
      }
    } finally {
      lock.releaseLock()
    }
  }
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + email)
  return 'u' + Utilities.base64EncodeWebSafe(bytes).replace(/[^A-Za-z0-9]/g, '').slice(0, 14)
}

function isTeacherEmail_(email) {
  var owner = (Session.getEffectiveUser().getEmail() || '').toLowerCase()
  if (email === owner) return true
  var extra = (PropertiesService.getScriptProperties().getProperty('TEACHER_EMAILS') || '').toLowerCase()
  return extra.split(',').map(function (s) { return s.trim() }).indexOf(email) !== -1
}

function isOwner_(email) {
  return email === (Session.getEffectiveUser().getEmail() || '').toLowerCase()
}

var CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
function code_(n) {
  var s = ''
  for (var i = 0; i < n; i++) s += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length))
  return s
}
function id_() {
  return Utilities.getUuid().replace(/-/g, '').slice(0, 12)
}
function clean_(s, max) {
  return String(s == null ? '' : s).slice(0, max)
}
function assert_(ok, msg) {
  if (!ok) throw new Error(msg)
}

// ---------------------------------------------------------------- API

/**
 * Single entry point called from the page: google.script.run.api(method, argsJson).
 * Every method checks permissions here on the server.
 */
function api(method, argsJson) {
  var args = JSON.parse(argsJson || '[]')
  var email = email_()
  var me = uidFor_(email)
  if (!API_[method]) throw new Error('Unknown action: ' + method)
  var mode = MODES_[method] || 'write'
  // Reads take no lock. "slow" actions (Classroom, backups) lock only around their own saves.
  if (mode !== 'write') return JSON.stringify(API_[method].apply(null, [Store_(), me, email].concat(args)))
  sheet_() // make sure storage exists before taking the lock
  return JSON.stringify(
    withLock_(function (db) {
      return API_[method].apply(null, [db, me, email].concat(args))
    }),
  )
}

var MODES_ = {
  me: 'read',
  snapshot: 'read',
  myClasses: 'read',
  dataInfo: 'read',
  crListCourses: 'read',
  backupNow: 'slow',
  crImportCourse: 'slow',
  crSyncRoster: 'slow',
  crCreateAssignments: 'slow',
  crPushGrades: 'slow',
}

function user_(db, me) {
  var u = db.get('users/' + me)
  assert_(u, 'Account not found. Reload the page.')
  return u
}
function cls_(db, cid) {
  var c = db.get('classes/' + cid)
  assert_(c, 'Class not found.')
  return c
}
function isTeacherOf_(db, me, cid) {
  var c = db.get('classes/' + cid)
  return !!c && c.teacherId === me
}
function isMember_(db, me, cid) {
  return !!db.get('members/' + cid + '/' + me)
}
function company_(db, cid, coid) {
  var co = db.get('companies/' + cid + '/' + coid)
  assert_(co, 'Company not found.')
  return co
}
function mustBeInCompany_(db, me, cid, co) {
  assert_(isTeacherOf_(db, me, cid) || co.memberIds.indexOf(me) !== -1, 'You are not in that company.')
}

var DEFAULT_SETTINGS = { maxCompanySize: 3, quizPassPercent: 70 }

var API_ = {
  me: function (db, me, email) {
    var u = db.get('users/' + me)
    if (!u) {
      // First visit: create the account. Saves need the lock; re-check inside it.
      u = withLock_(function (fresh) {
        var x = fresh.get('users/' + me)
        if (!x) {
          x = { uid: me, email: email, name: '', role: null, classIds: [] }
          fresh.set('users/' + me, x)
        }
        return x
      })
    }
    return { uid: u.uid, email: u.email, name: u.name, role: u.role, classIds: u.classIds, canTeach: isTeacherEmail_(email), isOwner: isOwner_(email) }
  },

  setRole: function (db, me, email, role) {
    assert_(role === 'student' || role === 'teacher', 'Unknown role.')
    if (role === 'teacher') assert_(isTeacherEmail_(email), 'Only teachers can choose the teacher role. Choose Student.')
    var u = user_(db, me)
    u.role = role
    db.set('users/' + me, u)
  },

  setName: function (db, me, email, name) {
    var u = user_(db, me)
    u.name = clean_(name, 40).trim()
    db.set('users/' + me, u)
    u.classIds.forEach(function (cid) {
      var m = db.get('members/' + cid + '/' + me)
      if (m) {
        m.name = u.name
        db.set('members/' + cid + '/' + me, m)
      }
    })
  },

  myClasses: function (db, me) {
    var u = db.get('users/' + me)
    if (!u) return []
    if (u.role === 'teacher') backupTick_()
    return u.classIds
      .map(function (cid) { return db.get('classes/' + cid) })
      .filter(function (c) { return !!c })
  },

  createClass: function (db, me, email, name) {
    var u = user_(db, me)
    assert_(u.role === 'teacher', 'Only teachers can create classes.')
    var c = {
      id: id_(),
      name: clean_(name, 80),
      teacherId: me,
      teacherName: u.name,
      joinCode: code_(6),
      createdAt: Date.now(),
      settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    }
    db.set('classes/' + c.id, c)
    u.classIds.push(c.id)
    db.set('users/' + me, u)
    return c
  },

  joinClass: function (db, me, email, code) {
    var u = user_(db, me)
    code = clean_(code, 10).trim().toUpperCase()
    var c = db.list('classes/').filter(function (x) { return x.joinCode === code })[0]
    assert_(c, 'No class found with that code. Check with your teacher.')
    if (u.classIds.indexOf(c.id) === -1) u.classIds.push(c.id)
    db.set('users/' + me, u)
    if (!db.get('members/' + c.id + '/' + me)) db.set('members/' + c.id + '/' + me, { uid: me, name: u.name, companyId: null, joinedAt: Date.now() })
    return c
  },

  updateClass: function (db, me, email, cid, patch) {
    assert_(isTeacherOf_(db, me, cid), 'Only the teacher can change the class.')
    var c = cls_(db, cid)
    if (patch.name != null) c.name = clean_(patch.name, 80)
    if (patch.settings) c.settings = patch.settings
    if (patch.board) c.board = patch.board
    db.set('classes/' + cid, c)
  },

  deleteClass: function (db, me, email, cid) {
    assert_(isTeacherOf_(db, me, cid), 'Only the teacher can delete the class.')
    db.del('classes/' + cid)
    var u = user_(db, me)
    u.classIds = u.classIds.filter(function (x) { return x !== cid })
    db.set('users/' + me, u)
  },

  /** Everything a class page needs, filtered for the viewer. */
  snapshot: function (db, me, email, cid) {
    var b = classBundle_(cid)
    if (!b.cls) return { cls: null }
    var teacher = b.cls.teacherId === me
    var mine = null
    b.members.forEach(function (m) {
      if (m.uid === me) mine = m
    })
    assert_(teacher || mine, 'You are not in this class.')
    var subs = b.submissions
    var members = b.members
    if (teacher) {
      backupTick_()
      // Teachers see each student's email on the roster; students never do.
      members = members.map(function (m) {
        if (b.emails[m.uid]) m.email = b.emails[m.uid]
        return m
      })
    } else {
      subs = subs.filter(function (s) { return s.companyId === mine.companyId })
    }
    return { cls: b.cls, members: members, companies: b.companies, submissions: subs, approvals: b.approvals }
  },

  /** Teacher home "Your data" card. Reads record names only. */
  dataInfo: function (db, me, email) {
    assert_(isTeacherEmail_(email), 'Only teachers can see this.')
    var props = props_()
    var names = db.names()
    var students = {}
    var classes = 0
    names.forEach(function (n) {
      var p = n.split('/')
      if (p[0] === 'members') students[p[2]] = 1
      if (p[0] === 'classes') classes++
    })
    var sid = props.getProperty('SHEET_ID')
    remember_('SHEET_ID', sid)
    var hist = JSON.parse(props.getProperty('storage:history') || '[]').filter(function (h) { return h.key === 'SHEET_ID' })
    var bid = props.getProperty('BACKUP_ID')
    var backups = []
    if (bid) {
      try {
        backups = SpreadsheetApp.openById(bid).getSheets().map(function (sh) { return sh.getName() }).filter(function (n) { return /^\d{4}-/.test(n) }).sort().reverse()
      } catch (e) {
        backups = []
      }
    }
    return {
      dataUrl: 'https://docs.google.com/spreadsheets/d/' + sid,
      backupsUrl: bid ? 'https://docs.google.com/spreadsheets/d/' + bid : '',
      students: Object.keys(students).length,
      classes: classes,
      today: today_(),
      lastBackup: props.getProperty('backup:last') || '',
      lastBackupAt: Number(props.getProperty('backup:at') || 0),
      backups: backups,
      otherData: hist.filter(function (h) { return h.id !== sid }).map(function (h) { return 'https://docs.google.com/spreadsheets/d/' + h.id }),
    }
  },

  backupNow: function (db, me, email) {
    assert_(isTeacherEmail_(email), 'Only teachers can make a backup.')
    backup_(true)
    return API_.dataInfo(Store_(), me, email)
  },

  removeMember: function (db, me, email, cid, uid) {
    assert_(isTeacherOf_(db, me, cid), 'Only the teacher can remove students.')
    var m = db.get('members/' + cid + '/' + uid)
    if (m && m.companyId) API_.leaveCompany(db, me, email, cid, m.companyId, uid)
    db.del('members/' + cid + '/' + uid)
    var u = db.get('users/' + uid)
    if (u) {
      u.classIds = u.classIds.filter(function (x) { return x !== cid })
      db.set('users/' + uid, u)
    }
  },

  createCompany: function (db, me, email, cid, data) {
    var m = db.get('members/' + cid + '/' + me)
    assert_(m, 'Join the class first.')
    assert_(!m.companyId, 'You are already in a company.')
    var co = {
      id: id_(),
      classId: cid,
      name: clean_(data.name, 28),
      tagline: clean_(data.tagline, 48),
      logo: data.logo,
      memberIds: [me],
      memberNames: {},
      inviteCode: code_(5),
      choices: {},
      quizzes: {},
      createdAt: Date.now(),
    }
    co.memberNames[me] = m.name
    db.set('companies/' + cid + '/' + co.id, co)
    m.companyId = co.id
    db.set('members/' + cid + '/' + me, m)
    return co
  },

  joinCompany: function (db, me, email, cid, invite) {
    var m = db.get('members/' + cid + '/' + me)
    assert_(m, 'Join the class first.')
    invite = clean_(invite, 10).trim().toUpperCase()
    var co = db.list('companies/' + cid + '/').filter(function (x) { return x.inviteCode === invite })[0]
    assert_(co, 'No company found with that invite code.')
    var max = cls_(db, cid).settings.maxCompanySize
    if (co.memberIds.indexOf(me) === -1) {
      assert_(co.memberIds.length < max, 'That company is full (max ' + max + ' people).')
      co.memberIds.push(me)
    }
    co.memberNames[me] = m.name
    db.set('companies/' + cid + '/' + co.id, co)
    m.companyId = co.id
    db.set('members/' + cid + '/' + me, m)
    return co
  },

  leaveCompany: function (db, me, email, cid, coid, who) {
    var target = who || me
    assert_(target === me || isTeacherOf_(db, me, cid), 'Only the teacher can remove someone else.')
    var co = db.get('companies/' + cid + '/' + coid)
    if (!co) return
    co.memberIds = co.memberIds.filter(function (x) { return x !== target })
    delete co.memberNames[target]
    if (co.memberIds.length === 0) db.del('companies/' + cid + '/' + coid)
    else db.set('companies/' + cid + '/' + coid, co)
    var m = db.get('members/' + cid + '/' + target)
    if (m) {
      m.companyId = null
      db.set('members/' + cid + '/' + target, m)
    }
  },

  updateCompany: function (db, me, email, cid, coid, patch) {
    var co = company_(db, cid, coid)
    mustBeInCompany_(db, me, cid, co)
    if (patch.name != null) co.name = clean_(patch.name, 28)
    if (patch.tagline != null) co.tagline = clean_(patch.tagline, 48)
    if (patch.logo) co.logo = patch.logo
    db.set('companies/' + cid + '/' + coid, co)
  },

  chooseBranch: function (db, me, email, cid, coid, branchId, lessonId) {
    var co = company_(db, cid, coid)
    mustBeInCompany_(db, me, cid, co)
    if (lessonId) co.choices[branchId] = clean_(lessonId, 40)
    else {
      assert_(isTeacherOf_(db, me, cid), 'Only the teacher can undo a path choice.')
      delete co.choices[branchId]
    }
    db.set('companies/' + cid + '/' + coid, co)
  },

  recordQuiz: function (db, me, email, cid, coid, lessonId, uid, result) {
    var co = company_(db, cid, coid)
    var teacher = isTeacherOf_(db, me, cid)
    // Students record only their own score; the teacher may excuse someone.
    assert_(teacher ? !!result.excused : uid === me && !result.excused, 'You can only record your own quiz.')
    assert_(co.memberIds.indexOf(uid) !== -1, 'That student is not in this company.')
    var byUser = co.quizzes[lessonId] || {}
    var prev = byUser[uid]
    var better
    if (!prev) better = true
    else if (result.excused) better = !prev.excused && prev.score / Math.max(1, prev.total) < 0.7
    else if (prev.excused) better = true
    else better = result.score / result.total >= prev.score / prev.total
    if (better) {
      byUser[uid] = {
        score: Number(result.score) || 0,
        total: Number(result.total) || 0,
        by: me,
        byName: teacher ? 'Teacher' : (co.memberNames[me] || ''),
        at: Date.now(),
        excused: !!result.excused,
      }
      co.quizzes[lessonId] = byUser
      db.set('companies/' + cid + '/' + coid, co)
    }
  },

  savePlan: function (db, me, email, cid, coid, lessonId, plan) {
    var co = company_(db, cid, coid)
    mustBeInCompany_(db, me, cid, co)
    var teacher = isTeacherOf_(db, me, cid)
    var prev = (co.plans || {})[lessonId]
    co.plans = co.plans || {}
    co.plans[lessonId] = {
      idea: clean_(plan.idea, 120),
      pitch: clean_(plan.pitch, 300),
      must: (plan.must || []).slice(0, 3).map(function (s) { return clean_(s, 120) }),
      nice: (plan.nice || []).slice(0, 8).map(function (s) { return clean_(s, 120) }),
      roles: plan.roles || {},
      // Only the teacher can approve a plan or write feedback.
      approved: teacher ? !!plan.approved : false,
      feedback: teacher ? clean_(plan.feedback, 600) : (prev ? prev.feedback : ''),
      updatedAt: Date.now(),
    }
    db.set('companies/' + cid + '/' + coid, co)
  },

  submit: function (db, me, email, cid, coid, sub) {
    var co = company_(db, cid, coid)
    assert_(co.memberIds.indexOf(me) !== -1, 'You are not in that company.')
    var s = {
      // The page sends an id so that a retried request can never save the same build twice.
      id: /^[a-z0-9]{8,24}$/.test(String(sub.rid || '')) ? String(sub.rid) : id_(),
      classId: cid,
      companyId: coid,
      companyName: co.name,
      lessonId: clean_(sub.lessonId, 40),
      link: clean_(sub.link, 500),
      notes: clean_(sub.notes, 1000),
      claimsBonus: !!sub.claimsBonus,
      aia: sub.aia || null,
      status: 'pending',
      feedback: '',
      bonusApproved: false,
      submittedBy: me,
      submittedByName: co.memberNames[me] || '',
      submittedAt: Date.now(),
      reviewedAt: null,
    }
    if (sub.contributions) {
      s.contributions = {}
      for (var k in sub.contributions) s.contributions[k] = clean_(sub.contributions[k], 500)
    }
    db.set('submissions/' + cid + '/' + s.id, s)
  },

  review: function (db, me, email, cid, sid, rev, solo) {
    assert_(isTeacherOf_(db, me, cid), 'Only the teacher can review builds.')
    var s = db.get('submissions/' + cid + '/' + sid)
    assert_(s, 'Submission not found.')
    var wasApproved = s.status === 'approved'
    s.status = rev.status === 'approved' ? 'approved' : 'returned'
    s.feedback = clean_(rev.feedback, 2000)
    s.bonusApproved = s.status === 'approved' && !!rev.bonusApproved
    s.reviewedAt = Date.now()
    db.set('submissions/' + cid + '/' + sid, s)
    var aid = s.companyId + '__' + s.lessonId + (solo ? '__' + s.submittedBy : '')
    if (s.status === 'approved') {
      var a = { id: aid, companyId: s.companyId, lessonId: s.lessonId, bonus: s.bonusApproved, at: Date.now() }
      if (solo) a.uid = s.submittedBy
      db.set('approvals/' + cid + '/' + aid, a)
    } else if (wasApproved) db.del('approvals/' + cid + '/' + aid)
  },

  // ------------------------------------------------------------ Google Classroom

  crListCourses: function (db, me, email) {
    classroomReady_(email)
    var out = []
    var token
    do {
      var res = Classroom.Courses.list({ teacherId: 'me', courseStates: ['ACTIVE'], pageSize: 100, pageToken: token })
      ;(res.courses || []).forEach(function (c) {
        out.push({ id: c.id, name: c.name, section: c.section || '' })
      })
      token = res.nextPageToken
    } while (token)
    return out
  },

  crImportCourse: function (db, me, email, courseId, classId) {
    classroomReady_(email)
    var course = Classroom.Courses.get(courseId)
    var cid = withLock_(function (fresh) {
      var c
      if (classId) {
        assert_(isTeacherOf_(fresh, me, classId), 'Only the teacher can link this class.')
        c = cls_(fresh, classId)
      } else {
        c = API_.createClass(fresh, me, email, course.name + (course.section ? ' · ' + course.section : ''))
      }
      c.classroom = c.classroom || { courseId: courseId, courseName: course.name, coursework: {} }
      c.classroom.courseId = courseId
      c.classroom.courseName = course.name
      fresh.set('classes/' + c.id, c)
      return c.id
    })
    var r = importRoster_(cid, courseId)
    return { classId: cid, added: r.added, total: r.total }
  },

  crSyncRoster: function (db, me, email, cid) {
    classroomReady_(email)
    assert_(isTeacherOf_(db, me, cid), 'Only the teacher can sync the roster.')
    var c = cls_(db, cid)
    assert_(c.classroom, 'This class is not linked to Google Classroom yet.')
    return importRoster_(cid, c.classroom.courseId)
  },

  crCreateAssignments: function (db, me, email, cid, items, publish) {
    classroomReady_(email)
    assert_(isTeacherOf_(db, me, cid), 'Only the teacher can create assignments.')
    var c = cls_(db, cid)
    assert_(c.classroom, 'Link this class to Google Classroom first.')
    var courseId = c.classroom.courseId
    var topicId = c.classroom.topicId || Classroom.Courses.Topics.create({ name: 'AppVenture' }, courseId).topicId
    var base = ScriptApp.getService().getUrl()
    var results = []
    var made = {}
    // Talk to Classroom first (slow, no lock)…
    items.forEach(function (it) {
      try {
        if (c.classroom.coursework[it.lessonId]) {
          results.push({ lessonId: it.lessonId, ok: true, error: 'Already created' })
          return
        }
        var cw = Classroom.Courses.CourseWork.create(
          {
            title: clean_(it.title, 200),
            description: clean_(it.description, 4000),
            materials: [{ link: { url: base + '#/class/' + cid + '/lesson/' + it.lessonId, title: 'Open in AppVenture' } }],
            workType: 'ASSIGNMENT',
            state: publish ? 'PUBLISHED' : 'DRAFT',
            maxPoints: Number(it.points) || 100,
            topicId: topicId,
          },
          courseId,
        )
        made[it.lessonId] = { id: cw.id, link: cw.alternateLink, points: Number(it.points) || 100 }
        results.push({ lessonId: it.lessonId, ok: true })
      } catch (e) {
        results.push({ lessonId: it.lessonId, ok: false, error: String(e.message || e) })
      }
    })
    // …then save what was made (quick, locked).
    withLock_(function (fresh) {
      var cc = cls_(fresh, cid)
      cc.classroom.topicId = topicId
      for (var k in made) cc.classroom.coursework[k] = made[k]
      fresh.set('classes/' + cid, cc)
    })
    return results
  },

  crPushGrades: function (db, me, email, cid, grades) {
    classroomReady_(email)
    assert_(isTeacherOf_(db, me, cid), 'Only the teacher can send grades.')
    var c = cls_(db, cid)
    assert_(c.classroom, 'Link this class to Google Classroom first.')
    var courseId = c.classroom.courseId
    var out = { updated: 0, unchanged: 0, skipped: 0, errors: [] }
    var byLesson = {}
    var newPoints = {}
    grades.forEach(function (g) {
      ;(byLesson[g.lessonId] = byLesson[g.lessonId] || []).push(g)
    })
    Object.keys(byLesson).forEach(function (lessonId) {
      var cw = c.classroom.coursework[lessonId]
      if (!cw) {
        out.skipped += byLesson[lessonId].length
        return
      }
      // If the teacher changed the points in Classroom, scale grades to the new total.
      var scale = 1
      try {
        var live = Classroom.Courses.CourseWork.get(courseId, cw.id)
        if (live && live.maxPoints && cw.points && live.maxPoints !== cw.points) {
          scale = live.maxPoints / cw.points
          newPoints[lessonId] = live.maxPoints
        }
      } catch (e) {
        /* keep the saved points */
      }
      // Map Classroom user id → that student's submission for this assignment.
      var subs = {}
      var token
      do {
        var res = Classroom.Courses.CourseWork.StudentSubmissions.list(courseId, cw.id, { pageSize: 100, pageToken: token })
        ;(res.studentSubmissions || []).forEach(function (s) {
          subs[s.userId] = s
        })
        token = res.nextPageToken
      } while (token)
      byLesson[lessonId].forEach(function (g) {
        var points = Math.round(g.points * scale * 10) / 10
        var u = db.get('users/' + g.uid)
        var sub = u && u.gid ? subs[u.gid] : null
        if (!sub) {
          out.skipped++
          return
        }
        if (sub.draftGrade === points || sub.assignedGrade === points) {
          out.unchanged++
          return
        }
        try {
          Classroom.Courses.CourseWork.StudentSubmissions.patch({ draftGrade: points }, courseId, cw.id, sub.id, { updateMask: 'draftGrade' })
          out.updated++
        } catch (e) {
          out.errors.push((u.name || 'A student') + ': ' + String(e.message || e))
        }
      })
    })
    withLock_(function (fresh) {
      var cc = cls_(fresh, cid)
      for (var k in newPoints) if (cc.classroom.coursework[k]) cc.classroom.coursework[k].points = newPoints[k]
      cc.classroom.lastGradeSync = Date.now()
      fresh.set('classes/' + cid, cc)
    })
    return out
  },
}

function classroomReady_(email) {
  assert_(isOwner_(email), 'Only the account that owns this AppVenture script can use Google Classroom.')
  assert_(typeof Classroom !== 'undefined', 'Turn on Google Classroom first: in the script editor, Services (+) → Google Classroom API → Add, then deploy a new version.')
}

/** Adds every student in the linked course to the class (first name + last initial). */
function importRoster_(cid, courseId) {
  // Read the roster from Classroom first (slow, no lock)…
  var students = []
  var token
  do {
    var res = Classroom.Courses.Students.list(courseId, { pageSize: 100, pageToken: token })
    ;(res.students || []).forEach(function (st) {
      students.push(st)
    })
    token = res.nextPageToken
  } while (token)
  // …then save (locked). Existing students and their work are never changed, only added to.
  return withLock_(function (db) {
    db.loadAll()
    var c = cls_(db, cid)
    var added = 0
    var total = 0
    students.forEach(function (st) {
      var p = st.profile || {}
      var mail = String(p.emailAddress || '').toLowerCase()
      if (!mail) return
      total++
      var given = (p.name && p.name.givenName) || ''
      var family = (p.name && p.name.familyName) || ''
      var short = (given + (family ? ' ' + family.charAt(0) + '.' : '')).trim() || 'Student'
      var uid = uidFor_(mail)
      var u = db.get('users/' + uid)
      var before = JSON.stringify(u)
      if (!u) u = { uid: uid, email: mail, name: short, role: 'student', classIds: [] }
      if (!u.name) u.name = short
      if (!u.role) u.role = 'student'
      u.gid = st.userId
      if (u.classIds.indexOf(cid) === -1) u.classIds.push(cid)
      if (JSON.stringify(u) !== before) db.set('users/' + uid, u)
      if (!db.get('members/' + cid + '/' + uid)) {
        db.set('members/' + cid + '/' + uid, { uid: uid, name: u.name, companyId: null, joinedAt: Date.now() })
        added++
      }
    })
    c.classroom.lastRosterSync = Date.now()
    db.set('classes/' + cid, c)
    return { added: added, total: total }
  })
}
