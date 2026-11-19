// Serves the built Apps Script page (apps-script/index.html) against the mock Google services,
// for browser tests and for trying the Google version locally:
//   npm run build:appsscript && node tests/dev-server.cjs      → http://localhost:4300/?as=you@holliston.k12.ma.us
// Test hooks:  /__busy?n=3  turns away the next 3 save requests · /__sheet · /__classroom · /__setmax?id=&max=
const http = require('http')
const fs = require('fs')
const path = require('path')
const { createMock } = require('./gas-mock.cjs')

const m = createMock()
let busy = 0
let busyServed = 0

// A small pretend Google Classroom.
const cr = { coursework: {}, grades: {} }
const STUDENTS = [
  { userId: 'g1', profile: { emailAddress: 'ava.r@holliston.k12.ma.us', name: { givenName: 'Ava', familyName: 'Rodriguez' } } },
  { userId: 'g2', profile: { emailAddress: 'liam.k@holliston.k12.ma.us', name: { givenName: 'Liam', familyName: 'Kim' } } },
]
m.ctx.Classroom = {
  Courses: {
    list: () => ({ courses: [{ id: 'c1', name: 'Digital Literacy & CS', section: 'Period 3' }] }),
    get: (id) => ({ id, name: 'Digital Literacy & CS', section: 'Period 3' }),
    Students: { list: () => ({ students: STUDENTS }) },
    Topics: { create: () => ({ topicId: 't1' }) },
    CourseWork: {
      get: (courseId, id) => ({ id, maxPoints: cr.coursework[id].maxPoints }),
      create: (res) => { const id = 'cw' + (Object.keys(cr.coursework).length + 1); cr.coursework[id] = res; return { id, alternateLink: 'https://classroom.google.com/c/x/a/' + id } },
      StudentSubmissions: {
        list: (courseId, cwId) => ({ studentSubmissions: STUDENTS.map((st) => ({ id: 'sub-' + cwId + '-' + st.userId, userId: st.userId, draftGrade: cr.grades[cwId + '/' + st.userId] })) }),
        patch: (res, courseId, cwId, subId, opts) => { if (opts.updateMask !== 'draftGrade') throw new Error('bad mask'); cr.grades[cwId + '/' + subId.split('-').pop()] = res.draftGrade },
      },
    },
  },
}

const shim = `<script>
const AS = new URLSearchParams(location.search).get('as') || '';
const H = new URLSearchParams(location.search).get('h') || '';
function mk(){ let ok=()=>{}, bad=()=>{}; const o={ withSuccessHandler(f){ok=f;return o}, withFailureHandler(f){bad=f;return o},
  api(m,a){ fetch('/api',{method:'POST',headers:{'x-email':AS},body:JSON.stringify({m,a})}).then(r=>r.json()).then(j=>j.error?bad(new Error(j.error)):ok(j.result)) } }; return o }
window.google={script:{get run(){return mk()}, url:{getLocation(cb){setTimeout(()=>cb({hash:H}),0)}}}};
</script>`
const READS = new Set(['me', 'snapshot', 'myClasses', 'dataInfo', 'crListCourses'])

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const json = (o) => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(o)) }
  if (req.method === 'POST' && url.pathname === '/api') {
    let body = ''
    req.on('data', (d) => (body += d))
    req.on('end', () => {
      const { m: method, a } = JSON.parse(body)
      if (busy > 0 && !READS.has(method)) {
        busy--; busyServed++
        return json({ error: 'Exception: There are too many simultaneous invocations of this script for this Google user account.' })
      }
      try {
        m.state.email = req.headers['x-email'] || ''
        json({ result: m.ctx.api(method, a) })
      } catch (e) {
        json({ error: e.message })
      }
    })
  } else if (url.pathname === '/__busy') { busy = Number(url.searchParams.get('n') || 0); busyServed = 0; json({ busy })
  } else if (url.pathname === '/__busyServed') json({ busyServed })
  else if (url.pathname === '/__sheet') json(m.dataSheet()?.rows ?? [])
  else if (url.pathname === '/__classroom') json(cr)
  else if (url.pathname === '/__setmax') { cr.coursework[url.searchParams.get('id')].maxPoints = Number(url.searchParams.get('max')); json({ ok: true })
  } else {
    const html = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'index.html'), 'utf8').replace('<head>', '<head>' + shim)
    res.setHeader('content-type', 'text/html'); res.end(html)
  }
})
const port = Number(process.env.PORT || 4300)
server.listen(port, () => console.log('AppVenture (mock Google) on http://localhost:' + port))
