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

var SHEET_NAME = 'data'

function sheet_() {
  var props = PropertiesService.getScriptProperties()
  var id = props.getProperty('SHEET_ID')
  var ss = null
  if (id) {
    try {
      ss = SpreadsheetApp.openById(id)
    } catch (e) {
      ss = null
    }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('AppVenture Data')
    props.setProperty('SHEET_ID', ss.getId())
    var sh0 = ss.getSheets()[0]
    sh0.setName(SHEET_NAME)
    sh0.getRange(1, 1, 1, 3).setValues([['path', 'json', 'updated']])
    sh0.setFrozenRows(1)
  }
  return ss.getSheetByName(SHEET_NAME)
}

/** Loads every document. Small classes = a few hundred rows, fast enough. */
function Store_() {
  var sh = sheet_()
  var last = sh.getLastRow()
  var rows = last > 1 ? sh.getRange(2, 1, last - 1, 2).getValues() : []
  var docs = {}
  var rowOf = {}
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i][0]) continue
    try {
      docs[rows[i][0]] = JSON.parse(rows[i][1])
      rowOf[rows[i][0]] = i + 2
    } catch (e) {
      /* skip damaged row */
    }
  }
  return {
    get: function (path) {
      return docs[path] ? JSON.parse(JSON.stringify(docs[path])) : null
    },
    list: function (prefix) {
      var out = []
      for (var p in docs) if (p.indexOf(prefix) === 0 && p.slice(prefix.length).indexOf('/') === -1) out.push(JSON.parse(JSON.stringify(docs[p])))
      return out
    },
    set: function (path, obj) {
      var json = JSON.stringify(obj)
      if (json.length > 45000) throw new Error('That is too much data to save at once.')
      docs[path] = obj
      if (rowOf[path]) sh.getRange(rowOf[path], 2, 1, 2).setValues([[json, new Date()]])
      else {
        sh.appendRow([path, json, new Date()])
        rowOf[path] = sh.getLastRow()
      }
    },
    del: function (path) {
      if (!rowOf[path]) return
      sh.deleteRow(rowOf[path])
      var removed = rowOf[path]
      delete docs[path]
      delete rowOf[path]
      for (var p in rowOf) if (rowOf[p] > removed) rowOf[p]--
    },
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
  var props = PropertiesService.getScriptProperties()
  var salt = props.getProperty('SALT')
  if (!salt) {
    salt = Utilities.getUuid()
    props.setProperty('SALT', salt)
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
  var reads = { me: 1, snapshot: 1, myClasses: 1 }
  if (!API_[method]) throw new Error('Unknown action: ' + method)
  if (reads[method]) return JSON.stringify(API_[method].apply(null, [Store_(), me, email].concat(args)))
  var lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    return JSON.stringify(API_[method].apply(null, [Store_(), me, email].concat(args)))
  } finally {
    lock.releaseLock()
  }
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
      // First visit: create the account. Writes need the lock.
      var lock = LockService.getScriptLock()
      lock.waitLock(20000)
      try {
        var fresh = Store_()
        u = fresh.get('users/' + me)
        if (!u) {
          u = { uid: me, email: email, name: '', role: null, classIds: [] }
          fresh.set('users/' + me, u)
        }
      } finally {
        lock.releaseLock()
      }
    }
    return { uid: u.uid, email: u.email, name: u.name, role: u.role, classIds: u.classIds, canTeach: isTeacherEmail_(email) }
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
    var c = db.get('classes/' + cid)
    if (!c) return { cls: null }
    var teacher = c.teacherId === me
    assert_(teacher || isMember_(db, me, cid), 'You are not in this class.')
    var members = db.list('members/' + cid + '/')
    var companies = db.list('companies/' + cid + '/')
    var subs = db.list('submissions/' + cid + '/')
    if (!teacher) {
      var mine = (db.get('members/' + cid + '/' + me) || {}).companyId
      subs = subs.filter(function (s) { return s.companyId === mine })
    }
    if (teacher) {
      // Teachers see each student's email on the roster; students never do.
      members = members.map(function (m) {
        var u = db.get('users/' + m.uid)
        if (u) m.email = u.email
        return m
      })
    }
    return { cls: c, members: members, companies: companies, submissions: subs, approvals: db.list('approvals/' + cid + '/') }
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
      id: id_(),
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
}
