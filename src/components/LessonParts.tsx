import { useState } from 'react'
import type { CapstonePlan, Company, Lesson, LessonStep } from '../types'
import { backend } from '../data'
import { Md } from './Md'
import { Blocks } from './Blocks'
import { SpeakButton } from './Speak'
import { useAction } from './ui'

const EDITOR_TAG: Record<string, { label: string; color: string }> = {
  designer: { label: '🎨 In the Designer', color: 'var(--core)' },
  blocks: { label: '🧩 In the Blocks editor', color: 'var(--blk-event)' },
  phone: { label: '📱 On your phone', color: 'var(--tools)' },
}

/** One build step with all of its supports. */
export function StepView({ step, simple }: { step: LessonStep; simple: boolean }) {
  const text = simple && step.simple ? step.simple : step.body
  return (
    <div>
      {step.day && <div className="day-banner">📅 Day {step.day} starts here</div>}
      {step.editor && (
        <div className="editor-tag" style={{ color: EDITOR_TAG[step.editor].color }}>
          {EDITOR_TAG[step.editor].label}
        </div>
      )}
      <div className="spread" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
        <h2>{step.title}</h2>
        <SpeakButton text={`${step.title}. ${text}`} />
      </div>
      {step.newBlocks && step.newBlocks.length > 0 && (
        <div className="callout new">
          <span className="t">✨ New this step</span>
          <ul>
            {step.newBlocks.map((b) => (
              <li key={b.name}>
                <strong>{b.name}</strong> <span className="muted">({b.where})</span>: {b.what}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mission-text">
        <Md text={text} />
      </div>
      {simple && step.simple && step.body !== step.simple && (
        <details className="more small">
          <summary>Show the full instructions</summary>
          <div style={{ marginTop: 6 }}>
            <Md text={step.body} />
          </div>
        </details>
      )}
      {step.blocks && <Blocks lines={step.blocks} />}
      {step.blocks?.some((l) => /_{3,}/.test(l)) && <p className="small muted">The dashed boxes are yours to fill in. The words above say what goes there.</p>}
      {step.frames && step.frames.length > 0 && (
        <div className="callout frames">
          <span className="t">✍️ Sentence starters</span>
          <ul>
            {step.frames.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      {step.check && (
        <div className="callout check">
          <span className="t">✅ Test now</span>
          {step.check}
        </div>
      )}
      {step.stuck && step.stuck.length > 0 && (
        <div className="callout stuck">
          <details>
            <summary>🛟 Stuck? Check this</summary>
            <ul>
              {step.stuck.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  )
}

/** The required "you do" task: a feature described in words, hints revealed one at a time. */
export function RemixView({ remix }: { remix: NonNullable<Lesson['remix']> }) {
  const [shown, setShown] = useState(0)
  return (
    <div>
      <div className="editor-tag" style={{ color: 'var(--media)' }}>
        🎛️ Remix: on your own
      </div>
      <div className="spread" style={{ alignItems: 'flex-start', flexWrap: 'nowrap' }}>
        <h2>{remix.title}</h2>
        <SpeakButton text={`${remix.title}. ${remix.spec}`} />
      </div>
      <p className="small muted" style={{ fontWeight: 800 }}>
        No blocks this time. Use what you just learned. Try it before you open a hint.
      </p>
      <div className="mission-text">
        <Md text={remix.spec} />
      </div>
      <div className="stack" style={{ marginTop: 12 }}>
        {remix.hints.slice(0, shown).map((h, i) => (
          <div key={i} className="callout stuck pop">
            <span className="t">💡 Hint {i + 1}</span>
            {h}
          </div>
        ))}
      </div>
      {shown < remix.hints.length && (
        <button className="small" style={{ marginTop: 10 }} onClick={() => setShown(shown + 1)}>
          💡 Show hint {shown + 1} of {remix.hints.length}
        </button>
      )}
    </div>
  )
}

export function DevicesBox({ devices }: { devices: NonNullable<Lesson['devices']> }) {
  return (
    <details className="card more">
      <summary>📵 If your device can't do this…</summary>
      <div className="stack" style={{ marginTop: 10 }}>
        {devices.map((d) => (
          <div key={d.need}>
            <strong>{d.need}</strong>
            <div>{d.fallback}</div>
          </div>
        ))}
      </div>
    </details>
  )
}

const emptyPlan = (company: Company | null): CapstonePlan => ({
  idea: '',
  pitch: '',
  must: ['', '', ''],
  nice: ['', ''],
  roles: Object.fromEntries((company?.memberIds ?? []).map((u) => [u, ''])),
  approved: false,
  feedback: '',
  updatedAt: 0,
})

/** Idea cards, plus (for company capstones) a plan the teacher signs off on. */
export function IdeasAndPlan({ lesson, company, classId }: { lesson: Lesson; company: Company | null; classId?: string }) {
  const saved = company?.plans?.[lesson.id]
  const [plan, setPlan] = useState<CapstonePlan>(() => saved ?? emptyPlan(company))
  const [savedOk, setSavedOk] = useState(false)
  const { busy, error, run } = useAction()
  const ideas = lesson.ideas ?? []
  const solo = !!lesson.individual
  const canPlan = !!company && !!classId && !solo
  const edit = (p: Partial<CapstonePlan>) => {
    setPlan({ ...plan, ...p })
    setSavedOk(false)
  }
  return (
    <>
      <div className="card">
        <h3>{solo ? '🗂️ Pick one challenge' : '💡 Idea cards'}</h3>
        <p className="small muted">{solo ? 'You work alone on this one. Pick the card you want to build.' : 'Each idea is doable with what you learned. Pick one or invent your own.'}</p>
        <div className="grid cols-2" style={{ gap: 12 }}>
          {ideas.map((idea) => (
            <button key={idea.title} className={`idea-card ${plan.idea === idea.title ? 'on' : ''}`} onClick={() => edit({ idea: idea.title })} aria-pressed={plan.idea === idea.title}>
              <span className="t">{idea.title}</span>
              <span style={{ display: 'block', margin: '4px 0' }}>{idea.pitch}</span>
              <span className="small muted" style={{ display: 'block' }}>
                Uses: {idea.uses.join(', ')}
              </span>
              <span className="small" style={{ display: 'block', marginTop: 4 }}>
                ⭐ Stretch: {idea.stretch}
              </span>
            </button>
          ))}
        </div>
      </div>

      {canPlan && (
        <div className="card">
          <div className="spread">
            <h3 style={{ margin: 0 }}>📝 Our plan</h3>
            {saved?.approved ? <span className="chip good">✅ Teacher approved</span> : saved ? <span className="chip warn">Waiting for teacher</span> : null}
          </div>
          {saved?.feedback && <div className="alert" style={{ marginTop: 10 }}>💬 Teacher: {saved.feedback}</div>}
          <label className="field" style={{ marginTop: 12 }}>
            <span>Our idea</span>
            <input value={plan.idea} onChange={(e) => edit({ idea: e.target.value })} placeholder="Pick a card above or type your own" />
          </label>
          <label className="field">
            <span>One-sentence pitch</span>
            <input value={plan.pitch} onChange={(e) => edit({ pitch: e.target.value })} placeholder="Our app lets ___ do ___ so that ___." />
          </label>
          <div className="grid cols-2" style={{ gap: 12 }}>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>MUST have (max 3)</div>
              {plan.must.map((m, i) => (
                <input key={i} value={m} style={{ marginBottom: 6 }} aria-label={`Must-have feature ${i + 1}`} onChange={(e) => edit({ must: plan.must.map((x, j) => (j === i ? e.target.value : x)) })} />
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 4 }}>NICE to have (only if there's time)</div>
              {plan.nice.map((m, i) => (
                <input key={i} value={m} style={{ marginBottom: 6 }} aria-label={`Nice-to-have feature ${i + 1}`} onChange={(e) => edit({ nice: plan.nice.map((x, j) => (j === i ? e.target.value : x)) })} />
              ))}
              <button className="small" onClick={() => edit({ nice: [...plan.nice, ''] })}>
                + Add
              </button>
            </div>
          </div>
          <div style={{ fontWeight: 800, margin: '12px 0 4px' }}>Who does what</div>
          {company!.memberIds.map((uid) => (
            <label key={uid} className="row" style={{ gap: 8, marginBottom: 6, flexWrap: 'nowrap' }}>
              <span style={{ minWidth: 80 }}>{company!.memberNames[uid]}</span>
              <input value={plan.roles[uid] ?? ''} placeholder="e.g. builds the score system, makes the art" onChange={(e) => edit({ roles: { ...plan.roles, [uid]: e.target.value } })} />
            </label>
          ))}
          <button
            className="gold"
            style={{ marginTop: 10 }}
            disabled={busy || !plan.idea.trim() || !plan.must.some((m) => m.trim())}
            onClick={async () => {
              const ok = await run(() => backend.savePlan(classId!, company!.id, lesson.id, { ...plan, approved: false, feedback: saved?.feedback ?? '', updatedAt: Date.now() }))
              if (ok) setSavedOk(true)
            }}
          >
            {saved ? 'Update plan' : 'Send plan to teacher'}
          </button>
          {savedOk && <span className="small muted"> Sent ✓</span>}
          {saved?.approved && <p className="small muted">Changing the plan sends it back for approval.</p>}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </>
  )
}
