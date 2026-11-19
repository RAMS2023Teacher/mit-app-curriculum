import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { backend } from '../data'
import { useAuth } from '../data/hooks'
import { usePlayer } from '../game/hooks'
import { BADGES, PARTS, SLOTS, SLOT_LABEL, type Slot } from '../game/catalog'
import { MANIFEST } from '../game/manifest'
import { hasBadge, howToGet, levelOf, spendable, unlocked } from '../game/rules.js'
import type { Player } from '../game/types'
import { Buddy } from '../components/Buddy'
import { ask } from '../components/confirm'
import { Loading, timeAgo, useAction } from '../components/ui'
import { coinBurst, sfx, showGain } from '../lib/fx'

export function LevelBar({ player }: { player: Player }) {
  const lv = levelOf(player.xp, MANIFEST)
  const pct = lv.next ? Math.min(100, ((player.xp - lv.min) / (lv.next - lv.min)) * 100) : 100
  return (
    <div>
      <div className="spread small" style={{ marginBottom: 4, fontWeight: 900 }}>
        <span>
          Level {lv.n} · {lv.title}
        </span>
        {lv.next ? <span className="muted">{lv.next - player.xp} XP to level {lv.n + 1}</span> : <span className="muted">Top level!</span>}
      </div>
      <div className="xpbar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to the next level">
        <div style={{ width: `${pct}%` }} />
        <span>{player.xp} XP earned</span>
      </div>
    </div>
  )
}

export function MePage() {
  const { classId } = useParams()
  const { user } = useAuth()
  const player = usePlayer(classId)
  const [tab, setTab] = useState<'look' | 'badges' | 'log'>('look')
  const [note, setNote] = useState('')
  const { busy, error, run, setError } = useAction()
  if (!backend.game) return <Navigate to={`/class/${classId}`} replace />
  if (!player) return <Loading />
  const avatar = { ...MANIFEST.slotDefaults, ...player.avatar }
  const toSpend = spendable(player)

  const pick = (slot: Slot, id: string) => {
    const key = `${slot}:${id}`
    const part = MANIFEST.parts[key]
    setNote('')
    setError('')
    if (unlocked(player, key, MANIFEST)) {
      if (avatar[slot] === id) return
      sfx.tick()
      return void run(async () => showGain(await backend.game!.saveAvatar(classId!, { ...avatar, [slot]: id })))
    }
    if (part.rule.type === 'cost') {
      const price = part.rule.n
      if (toSpend < price) {
        sfx.buzz()
        return setNote(`"${part.name}" costs ${price} XP. You need ${price - toSpend} more XP to spend.`)
      }
      return void ask(`Buy "${part.name}" for ${price} XP? You'll have ${toSpend - price} XP left to spend.`, `Buy for ${price} XP`).then((ok) => {
        if (!ok) return
        void run(async () => {
          await backend.game!.buy(classId!, `part:${key}`)
          coinBurst()
          showGain(await backend.game!.saveAvatar(classId!, { ...avatar, [slot]: id }))
        })
      })
    }
    sfx.buzz()
    setNote(`"${part.name}" is locked. ${howToGet(key, MANIFEST)}.`)
  }

  return (
    <div className="page">
      <div className="me-layout">
        <div className="card center me-card">
          <div className="bob" style={{ display: 'inline-block' }}>
            <Buddy avatar={avatar} size={190} title={`${user?.name}'s App Buddy`} />
          </div>
          <h2 style={{ margin: '8px 0 2px' }} translate="no">
            {user?.name}
          </h2>
          <div className="spend-chip" title="Total XP earned minus XP spent">
            ⚡ {toSpend} XP to spend
          </div>
          <div style={{ textAlign: 'left', marginTop: 12 }}>
            <LevelBar player={player} />
          </div>
          <p className="small muted" style={{ margin: '10px 0 0' }}>
            Spending XP never lowers your level.
          </p>
        </div>

        <div>
          <div className="tabs">
            <button className={tab === 'look' ? 'active' : ''} onClick={() => setTab('look')}>
              🎨 Buddy &amp; shop
            </button>
            <button className={tab === 'badges' ? 'active' : ''} onClick={() => setTab('badges')}>
              🏅 Badges ({BADGES.filter((b) => hasBadge(player, b.id)).length}/{BADGES.length})
            </button>
            <button className={tab === 'log' ? 'active' : ''} onClick={() => setTab('log')}>
              ⚡ My XP
            </button>
          </div>
          {(note || error) && (
            <div className="alert warn" role="status">
              {note || error}
            </div>
          )}

          {tab === 'look' && (
            <div className="stack">
              {SLOTS.map((slot) => (
                <div key={slot} className="card">
                  <h3>{SLOT_LABEL[slot]}</h3>
                  <div className="part-grid">
                    {PARTS.filter((p) => p.slot === slot).map((p) => {
                      const key = `${slot}:${p.id}`
                      const open = unlocked(player, key, MANIFEST)
                      const on = avatar[slot] === p.id
                      const price = p.rule.type === 'cost' ? p.rule.n : 0
                      const canBuy = !open && price > 0 && toSpend >= price
                      return (
                        <button
                          key={p.id}
                          className={`part ${on ? 'on' : ''} ${open || canBuy ? '' : 'locked'}`}
                          aria-pressed={on}
                          aria-disabled={!open && !canBuy}
                          disabled={busy}
                          onClick={() => pick(slot, p.id)}
                          title={open ? p.name : howToGet(key, MANIFEST)}
                        >
                          <Buddy avatar={{ ...avatar, [slot]: p.id }} size={64} />
                          <span className="part-name">{p.name}</span>
                          <span className="part-rule">{open ? (on ? '✔ Wearing' : p.rule.type === 'cost' ? 'Owned' : ' ') : price ? `🛒 ${price} XP` : `🔒 ${howToGet(key, MANIFEST)}`}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'badges' && (
            <div className="card">
              <div className="badge-grid">
                {BADGES.map((b) => {
                  const got = hasBadge(player, b.id)
                  return (
                    <div key={b.id} className={`badge-tile ${got ? 'got' : ''}`}>
                      <div className="badge-icon">{got ? b.icon : '🔒'}</div>
                      <div className="badge-name">{b.name}</div>
                      <div className="small muted">{b.desc}</div>
                    </div>
                  )
                })}
              </div>
              <p className="small muted" style={{ marginBottom: 0 }}>
                Every badge is worth +{MANIFEST.xp.badge} XP.
              </p>
            </div>
          )}

          {tab === 'log' && (
            <div className="card">
              <h3>How to earn XP</h3>
              <div className="row small" style={{ gap: 6, marginBottom: 14 }}>
                {[
                  ['Start a mission', MANIFEST.xp.start],
                  ['Each build step', MANIFEST.xp.step],
                  ['Pass the quiz', MANIFEST.xp.quiz],
                  ['Perfect quiz', MANIFEST.xp.perfect],
                  ['Perfect first try', MANIFEST.xp.first],
                  ['Build approved', MANIFEST.xp.ship],
                  ['Bonus quest', MANIFEST.xp.bonus],
                  ['Lesson complete', MANIFEST.xp.done],
                  ['Each badge', MANIFEST.xp.badge],
                ].map(([label, xp]) => (
                  <span key={label} className="chip">
                    {label} <strong className="xp-num">+{xp}</strong>
                  </span>
                ))}
              </div>
              <h3>Recent XP</h3>
              {player.log.length === 0 && <p className="muted">Nothing yet. Start a mission to earn your first XP!</p>}
              {player.log.map((l) => (
                <div key={l.key} className="spread" style={{ padding: '6px 0', borderBottom: '2px solid var(--line)' }}>
                  <span>
                    {l.label} <span className="small muted">· {timeAgo(l.at)}</span>
                  </span>
                  <span className="xp-num">+{l.xp}</span>
                </div>
              ))}
              {player.shopLog.length > 0 && (
                <>
                  <h3 style={{ marginTop: 16 }}>Bought</h3>
                  {player.shopLog.map((l) => (
                    <div key={l.item + l.at} className="spread small" style={{ padding: '4px 0' }}>
                      <span>
                        🛒 {l.label} <span className="muted">· {timeAgo(l.at)}</span>
                      </span>
                      <span className="muted">−{l.price}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
