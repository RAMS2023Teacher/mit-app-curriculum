import { useMemo } from 'react'
import type { Company } from '../types'
import { BRANCHES, TREE } from '../curriculum/tree'
import { TRACK_INFO, getLesson } from '../curriculum'
import { STATUS_LABEL, type CompanyProgress, type NodeStatus } from '../lib/progress'
import { LogoGlyph } from './Logo'

const COLW = 130
const ROWH = 108
const PADX = 90
const PADY = 64
const R = 30
/** Edges leave a node below its two-line label. */
const BELOW = R + 40

const px = (col: number) => PADX + col * COLW
const py = (row: number) => PADY + row * ROWH

const FORKS: Record<string, { col: number; row: number }> = {
  mini: { col: 3, row: 3.85 },
  path: { col: 3, row: 8.75 },
}

export interface TreeProps {
  companies: Company[]
  progress: Map<string, CompanyProgress>
  /** The company whose statuses color the tree (student view). */
  viewerCompanyId?: string | null
  /** Teacher view: how many companies completed each lesson. */
  showCounts?: boolean
  onSelect?: (lessonId: string) => void
}

const curve = (x1: number, y1: number, x2: number, y2: number) => {
  const my = (y1 + y2) / 2
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`
}

export function Tree({ companies, progress, viewerCompanyId, showCounts, onSelect }: TreeProps) {
  const viewer = viewerCompanyId ? progress.get(viewerCompanyId) : undefined
  const viewerCompany = companies.find((c) => c.id === viewerCompanyId)
  const status = (id: string): NodeStatus | null => viewer?.lessons[id]?.status ?? null
  const width = PADX * 2 + 6 * COLW
  const height = PADY * 2 + 14 * ROWH + 30

  // Group companies by where they are on the tree.
  const byPosition = useMemo(() => {
    const m = new Map<string, Company[]>()
    for (const c of companies) {
      const pos = progress.get(c.id)?.position ?? 'core-hello'
      const list = m.get(pos) ?? []
      list.push(c)
      m.set(pos, list)
    }
    return m
  }, [companies, progress])

  const completedCount = (lessonId: string) =>
    companies.filter((c) => progress.get(c.id)?.lessons[lessonId]?.status === 'complete').length

  // ---- edges
  const edges: { d: string; on: boolean; key: string }[] = []
  const isDone = (id: string) => status(id) === 'complete'
  for (const n of TREE) {
    for (const p of n.prereqs) {
      const pn = TREE.find((t) => t.lessonId === p)!
      if (n.branchId) {
        const f = FORKS[n.branchId]
        // prereq → fork drawn once per branch
        if (!edges.some((e) => e.key === `fork-${n.branchId}`))
          edges.push({ key: `fork-${n.branchId}`, d: curve(px(pn.col), py(pn.row) + BELOW, px(f.col), py(f.row) - 14), on: isDone(p) })
        const chosen = viewerCompany?.choices[n.branchId]
        edges.push({
          key: `${p}-${n.lessonId}`,
          d: curve(px(f.col), py(f.row) + 14, px(n.col), py(n.row) - R),
          on: isDone(p) && (!chosen || chosen === n.lessonId),
        })
      } else {
        edges.push({
          key: `${p}-${n.lessonId}`,
          // Side quests branch off sideways; everything else flows down.
          d: n.optional
            ? `M${px(pn.col) + Math.sign(n.col - pn.col) * R},${py(pn.row)} C${px(n.col)},${py(pn.row)} ${px(n.col)},${py(pn.row)} ${px(n.col)},${py(n.row) - R + 6}`
            : curve(px(pn.col), py(pn.row) + BELOW, px(n.col), py(n.row) - R),
          on: isDone(p) && status(n.lessonId) !== 'not-taken',
        })
      }
    }
  }

  const renderLogos = (pos: string, cx: number, cy: number, side: 1 | -1) => {
    const list = byPosition.get(pos)
    if (!list?.length) return null
    const mineFirst = [...list].sort((a) => (a.id === viewerCompanyId ? -1 : 1))
    const shown = mineFirst.slice(0, 4)
    const extra = list.length - shown.length
    const startX = cx + side * (R + 12)
    return (
      <g>
        {shown.map((c, i) => {
          const mine = c.id === viewerCompanyId
          const s = mine ? 40 : 32
          const x = side === 1 ? startX + i * 24 : startX - i * 24 - s
          const y = cy - s / 2 + (i % 2 ? 6 : -6)
          return (
            <g key={c.id}>
              <title>{`${c.name}: ${progress.get(c.id)?.xp ?? 0} XP`}</title>
              {mine && <circle cx={x + s / 2} cy={y + s / 2} r={s / 2 + 5} fill="var(--xp)" opacity="0.45" className="pulse" />}
              <LogoGlyph logo={c.logo} size={s} x={x} y={y} />
            </g>
          )
        })}
        {extra > 0 && (
          <text x={side === 1 ? startX + shown.length * 24 + 14 : startX - shown.length * 24 - 26} y={cy + 4} fontSize="12" fontWeight="700" fill="var(--ink-2)">
            +{extra}
          </text>
        )}
      </g>
    )
  }

  return (
    <div className="tree-wrap">
      <svg className="tree-svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="group" aria-label="Progression tree">
        {/* path region labels */}
        {[
          { col: 1, label: '🎮 Game Studio', color: 'var(--games)' },
          { col: 3, label: '🎬 Media House', color: 'var(--media)' },
          { col: 5, label: '🛠️ Tool Works', color: 'var(--tools)' },
        ].map((p) => (
          <g key={p.label}>
            <rect x={px(p.col) - 64} y={py(9.02)} width={128} height={py(13.0) - py(9.02)} rx="26" fill={p.color} opacity="0.07" />
            <text x={px(p.col)} y={py(9.02) + 17} textAnchor="middle" fontSize="12" fontWeight="700" fill={p.color}>
              {p.label}
            </text>
          </g>
        ))}

        {edges.map((e) => (
          <path
            key={e.key}
            d={e.d}
            fill="none"
            stroke={e.on ? 'var(--good)' : 'var(--line)'}
            strokeWidth={e.on ? 5 : 4}
            strokeDasharray={e.on ? undefined : '2 8'}
            strokeLinecap="round"
          />
        ))}

        {/* forks */}
        {Object.entries(FORKS).map(([id, f]) => {
          const chosen = viewerCompany?.choices[id]
          const atFork = viewer?.position === `fork:${id}`
          return (
            <g key={id} transform={`translate(${px(f.col)},${py(f.row)})`}>
              <title>{BRANCHES[id].label}</title>
              {atFork && <circle r="26" fill="var(--xp)" opacity="0.4" className="pulse" />}
              <rect x="-14" y="-14" width="28" height="28" rx="6" transform="rotate(45)" fill={chosen ? 'var(--good)' : 'var(--panel)'} stroke="var(--ink-3)" strokeWidth="2" />
              <text y="5" textAnchor="middle" fontSize="14">
                🔀
              </text>
              <text x="24" y="-4" fontSize="12" fontWeight="700" fill="var(--ink-2)">
                {BRANCHES[id].label}
              </text>
              <text x="24" y="11" fontSize="10.5" fill="var(--ink-3)">
                choose one path
              </text>
              {renderLogos(`fork:${id}`, 0, 0, -1)}
            </g>
          )
        })}

        {/* nodes */}
        {TREE.map((n) => {
          const lesson = getLesson(n.lessonId)
          if (!lesson) return null
          const x = px(n.col)
          const y = py(n.row)
          const st = status(n.lessonId)
          const color = TRACK_INFO[lesson.track].color
          const locked = st === 'locked'
          const faded = st === 'not-taken'
          const fill = st === null || st === 'complete' || !locked ? color : 'var(--panel-2)'
          const r = n.optional ? R - 6 : R
          const count = showCounts ? completedCount(n.lessonId) : 0
          const sub = st ? STATUS_LABEL[st] : n.optional ? 'Optional side quest' : `${lesson.xp.quiz + lesson.xp.build} XP`
          return (
            <g
              key={n.lessonId}
              className="tree-node"
              transform={`translate(${x},${y})`}
              opacity={faded ? 0.35 : 1}
              tabIndex={0}
              role="button"
              aria-label={`${lesson.title}. ${sub}`}
              onClick={() => onSelect?.(n.lessonId)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect?.(n.lessonId)}
            >
              <title>{`${lesson.title}: ${lesson.subtitle}`}</title>
              {st === 'available' && <circle r={r + 9} fill={color} opacity="0.3" className="pulse" />}
              {st === 'review' && <circle r={r + 7} fill="none" stroke="var(--warn)" strokeWidth="4" strokeDasharray="6 5" />}
              {st === 'returned' && <circle r={r + 7} fill="none" stroke="var(--bad)" strokeWidth="4" />}
              <circle
                className="node-circle"
                r={r}
                fill={fill}
                stroke={st === 'complete' ? 'var(--good)' : 'var(--panel)'}
                strokeWidth="4"
                strokeDasharray={n.optional ? '5 4' : undefined}
              />
              <text y="2" textAnchor="middle" dominantBaseline="middle" fontSize={n.optional ? 20 : 26} opacity={locked ? 0.45 : 1}>
                {locked ? '🔒' : lesson.icon}
              </text>
              {st === 'complete' && (
                <g transform={`translate(${r * 0.72},${-r * 0.72})`}>
                  <circle r="11" fill="var(--good)" stroke="var(--panel)" strokeWidth="3" />
                  <path d="M-5,0 L-1.5,3.5 L5,-3.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
              {showCounts && count > 0 && (
                <g transform={`translate(${-r * 0.72},${-r * 0.72})`}>
                  <circle r="11" fill="var(--good)" stroke="var(--panel)" strokeWidth="3" />
                  <text textAnchor="middle" dominantBaseline="middle" y="1" fontSize="11" fontWeight="700" fill="#fff">
                    {count}
                  </text>
                </g>
              )}
              <text className="tree-label" y={r + 18} textAnchor="middle">
                {lesson.title}
              </text>
              <text className="tree-sub" y={r + 32} textAnchor="middle">
                {sub}
              </text>
              {renderLogos(n.lessonId, 0, 0, n.col > 3 ? -1 : 1)}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function TreeLegend() {
  return (
    <div className="tree-legend">
      <span>
        <i style={{ background: 'var(--core)' }} /> Core skills
      </span>
      <span>
        <i style={{ background: 'var(--mini)' }} /> First product
      </span>
      <span>
        <i style={{ background: 'var(--side)' }} /> Optional side quest
      </span>
      <span>
        <i style={{ background: 'var(--games)' }} /> Games
      </span>
      <span>
        <i style={{ background: 'var(--media)' }} /> Media
      </span>
      <span>
        <i style={{ background: 'var(--tools)' }} /> Tools
      </span>
      <span>
        <i style={{ background: 'var(--launch)' }} /> Launch
      </span>
      <span>🔀 Choose one path</span>
    </div>
  )
}
