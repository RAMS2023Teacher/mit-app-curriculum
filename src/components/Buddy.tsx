import { useId, type ReactElement } from 'react'
import { MANIFEST } from '../game/manifest'

/** The App Buddy: a little device character each student customizes. */

const COLORS: Record<string, [string, string]> = {
  blue: ['#5b9bff', '#2f6bff'],
  green: ['#5fe07f', '#27b04e'],
  red: ['#ff7b84', '#e2394b'],
  purple: ['#b47bf0', '#8b45d6'],
  orange: ['#ffb061', '#f07f12'],
  pink: ['#ff9fd0', '#ee5aa6'],
  teal: ['#4fd9c8', '#11a391'],
  midnight: ['#4a5694', '#1b2350'],
  gold: ['#ffe680', '#f2ab00'],
  rainbow: ['#ff7b84', '#5b9bff'],
}

// Where the face and hat go for each body shape.
const BODY: Record<string, { eyeY: number; mouthY: number; top: number; half: number; bottom: number }> = {
  phone: { eyeY: 56, mouthY: 74, top: 24, half: 26, bottom: 106 },
  tablet: { eyeY: 58, mouthY: 76, top: 32, half: 38, bottom: 100 },
  round: { eyeY: 58, mouthY: 76, top: 30, half: 36, bottom: 102 },
  watch: { eyeY: 58, mouthY: 73, top: 40, half: 24, bottom: 88 },
  retro: { eyeY: 46, mouthY: 82, top: 22, half: 24, bottom: 108 },
}

const INK = '#1b2350'

export function Buddy({ avatar, size = 96, title }: { avatar?: Record<string, string>; size?: number; title?: string }) {
  const id = useId().replace(/:/g, '')
  const a = { ...MANIFEST.slotDefaults, ...(avatar ?? {}) }
  const B = BODY[a.body] ?? BODY.phone
  const [c1, c2] = COLORS[a.color] ?? COLORS.blue
  const fill = `url(#b${id})`
  const stroke = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: 'round' as const }

  const body: Record<string, ReactElement> = {
    phone: <rect x="34" y="24" width="52" height="82" rx="11" fill={fill} {...stroke} />,
    tablet: <rect x="22" y="32" width="76" height="68" rx="11" fill={fill} {...stroke} />,
    round: <circle cx="60" cy="66" r="36" fill={fill} {...stroke} />,
    watch: (
      <g>
        <rect x="46" y="20" width="28" height="24" rx="4" fill={c2} {...stroke} />
        <rect x="46" y="84" width="28" height="24" rx="4" fill={c2} {...stroke} />
        <rect x="36" y="40" width="48" height="48" rx="13" fill={fill} {...stroke} />
      </g>
    ),
    retro: (
      <g>
        <rect x="36" y="22" width="48" height="42" rx="8" fill={fill} {...stroke} />
        <rect x="36" y="64" width="48" height="44" rx="8" fill={fill} {...stroke} />
        {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={48 + c * 12} cy={92 + r * 6 - 6} r="1.8" fill={INK} opacity={r === 0 ? 0 : 0.5} />))}
      </g>
    ),
  }

  const L = 60 - 12
  const R = 60 + 12
  const y = B.eyeY
  const eyes: Record<string, ReactElement> = {
    dots: (
      <g fill={INK}>
        <circle cx={L} cy={y} r="4" />
        <circle cx={R} cy={y} r="4" />
      </g>
    ),
    happy: (
      <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
        <path d={`M${L - 5},${y + 2} Q${L},${y - 6} ${L + 5},${y + 2}`} />
        <path d={`M${R - 5},${y + 2} Q${R},${y - 6} ${R + 5},${y + 2}`} />
      </g>
    ),
    big: (
      <g>
        <circle cx={L} cy={y} r="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx={R} cy={y} r="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx={L + 2} cy={y + 1} r="3.5" fill={INK} />
        <circle cx={R + 2} cy={y + 1} r="3.5" fill={INK} />
      </g>
    ),
    wink: (
      <g>
        <circle cx={L} cy={y} r="4" fill={INK} />
        <path d={`M${R - 5},${y} L${R + 5},${y}`} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </g>
    ),
    sleepy: (
      <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
        <path d={`M${L - 5},${y - 1} Q${L},${y + 5} ${L + 5},${y - 1}`} />
        <path d={`M${R - 5},${y - 1} Q${R},${y + 5} ${R + 5},${y - 1}`} />
      </g>
    ),
    shades: (
      <g>
        <rect x={L - 9} y={y - 6} width="18" height="12" rx="4" fill={INK} />
        <rect x={R - 9} y={y - 6} width="18" height="12" rx="4" fill={INK} />
        <path d={`M${L + 9},${y - 2} L${R - 9},${y - 2}`} stroke={INK} strokeWidth="3" />
        <path d={`M${L - 5},${y - 3} l4,0`} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </g>
    ),
    stars: (
      <g fontSize="15" textAnchor="middle" dominantBaseline="central">
        <text x={L} y={y}>⭐</text>
        <text x={R} y={y}>⭐</text>
      </g>
    ),
    pixel: (
      <g fill={INK}>
        <rect x={L - 5} y={y - 5} width="10" height="10" />
        <rect x={R - 5} y={y - 5} width="10" height="10" />
        <rect x={L - 5} y={y - 5} width="4" height="4" fill="#fff" />
        <rect x={R - 5} y={y - 5} width="4" height="4" fill="#fff" />
      </g>
    ),
  }

  const my = B.mouthY
  const mouth: Record<string, ReactElement> = {
    smile: <path d={`M50,${my - 2} Q60,${my + 8} 70,${my - 2}`} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />,
    grin: <path d={`M48,${my - 3} Q60,${my + 13} 72,${my - 3} Z`} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />,
    oh: <ellipse cx="60" cy={my + 1} rx="5" ry="6.5" fill={INK} />,
    tongue: (
      <g>
        <path d={`M50,${my - 2} Q60,${my + 8} 70,${my - 2}`} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <path d={`M57,${my + 3} q4,10 8,0 Z`} fill="#ff6fa3" stroke={INK} strokeWidth="2" />
      </g>
    ),
    stache: (
      <g>
        <path d={`M60,${my - 2} q-7,-7 -14,2 q8,5 14,-2 q7,-7 14,2 q-8,5 -14,-2`} fill={INK} />
        <path d={`M54,${my + 6} Q60,${my + 10} 66,${my + 6}`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ),
    zigzag: <polyline points={`48,${my} 53,${my + 5} 58,${my} 63,${my + 5} 68,${my} 72,${my + 4}`} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />,
  }

  const t = B.top
  const top: Record<string, ReactElement | null> = {
    none: null,
    antenna: (
      <g>
        <path d={`M60,${t} L60,${t - 13}`} stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="60" cy={t - 16} r="5" fill="#ffc928" stroke={INK} strokeWidth="3" />
      </g>
    ),
    bow: (
      <g fill="#ff5aa0" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d={`M60,${t - 3} l-13,-8 l0,14 Z`} />
        <path d={`M60,${t - 3} l13,-8 l0,14 Z`} />
        <circle cx="60" cy={t - 3} r="4" />
      </g>
    ),
    cap: (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d={`M${60 - B.half + 4},${t + 3} Q60,${t - 22} ${60 + B.half - 4},${t + 3} Z`} fill="#e2394b" />
        <path d={`M${60 + B.half - 8},${t + 3} l18,3 l-18,4 Z`} fill="#b3202f" />
      </g>
    ),
    party: (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d={`M48,${t + 2} L60,${t - 24} L72,${t + 2} Z`} fill="#9b51e0" />
        <circle cx="60" cy={t - 25} r="4.5" fill="#ffc928" />
        <path d={`M53,${t - 8} l11,5`} stroke="#ffc928" strokeWidth="2.5" />
      </g>
    ),
    headphones: (
      <g>
        <path d={`M${60 - B.half - 3},${B.eyeY} Q${60 - B.half - 3},${t - 16} 60,${t - 16} Q${60 + B.half + 3},${t - 16} ${60 + B.half + 3},${B.eyeY}`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x={60 - B.half - 10} y={B.eyeY - 8} width="11" height="20" rx="5" fill="#ff5a5f" stroke={INK} strokeWidth="3" />
        <rect x={60 + B.half - 1} y={B.eyeY - 8} width="11" height="20" rx="5" fill="#ff5a5f" stroke={INK} strokeWidth="3" />
      </g>
    ),
    propeller: (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d={`M${60 - 18},${t + 3} Q60,${t - 16} ${60 + 18},${t + 3} Z`} fill="#11b39e" />
        <path d={`M60,${t - 6} L60,${t - 16}`} strokeLinecap="round" />
        <ellipse cx="50" cy={t - 17} rx="10" ry="4" fill="#ffc928" />
        <ellipse cx="70" cy={t - 17} rx="10" ry="4" fill="#ff5a5f" />
      </g>
    ),
    grad: (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d={`M60,${t - 18} L86,${t - 8} L60,${t + 2} L34,${t - 8} Z`} fill={INK} />
        <path d={`M82,${t - 8} l0,12`} stroke="#ffc928" strokeLinecap="round" />
        <circle cx="82" cy={t + 6} r="3" fill="#ffc928" />
      </g>
    ),
    crown: <path d={`M42,${t + 2} L42,${t - 16} L51,${t - 7} L60,${t - 20} L69,${t - 7} L78,${t - 16} L78,${t + 2} Z`} fill="#ffc928" stroke={INK} strokeWidth="3" strokeLinejoin="round" />,
  }

  const bt = Math.min(B.bottom - 8, my + 16)
  const behind: Record<string, ReactElement | null> = {
    cape: <path d={`M${60 - B.half + 4},${t + 16} L${60 - B.half - 18},${B.bottom + 4} L${60 + B.half + 18},${B.bottom + 4} L${60 + B.half - 4},${t + 16} Z`} fill="#e2394b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />,
    rocket: (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <rect x={60 - B.half - 12} y={B.eyeY} width="14" height="34" rx="6" fill="#c9d2df" />
        <rect x={60 + B.half - 2} y={B.eyeY} width="14" height="34" rx="6" fill="#c9d2df" />
        <path d={`M${60 - B.half - 10},${B.eyeY + 34} l5,14 l5,-14 Z`} fill="#ff8a1f" />
        <path d={`M${60 + B.half},${B.eyeY + 34} l5,14 l5,-14 Z`} fill="#ff8a1f" />
      </g>
    ),
  }
  const front: Record<string, ReactElement | null> = {
    none: null,
    bowtie: (
      <g fill="#e2394b" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d={`M60,${bt} l-11,-6 l0,12 Z`} />
        <path d={`M60,${bt} l11,-6 l0,12 Z`} />
        <circle cx="60" cy={bt} r="3" />
      </g>
    ),
    coffee: (
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <rect x={60 + B.half + 2} y={my - 6} width="14" height="16" rx="3" fill="#fff" />
        <path d={`M${60 + B.half + 16},${my - 2} q7,4 0,8`} fill="none" />
        <path d={`M${60 + B.half + 6},${my - 10} q3,-4 0,-8 M${60 + B.half + 12},${my - 10} q3,-4 0,-8`} fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>
    ),
    wrench: (
      <g transform={`translate(${60 + B.half + 4},${my - 12}) rotate(25)`} stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="-3" y="4" width="6" height="26" rx="2" fill="#c9d2df" />
        <path d="M-7,-6 a8,8 0 1 0 14,0 l-3,6 l-8,0 Z" fill="#c9d2df" />
      </g>
    ),
    medal: (
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d={`M55,${bt - 10} l5,8 l5,-8 Z`} fill="#2f6bff" />
        <circle cx="60" cy={bt + 3} r="6.5" fill="#ffc928" />
      </g>
    ),
    cape: null,
    rocket: null,
  }

  const bg: Record<string, ReactElement> = {
    plain: <rect width="120" height="120" rx="22" fill="#eef4ff" />,
    sky: (
      <g>
        <rect width="120" height="120" rx="22" fill={`url(#s${id})`} />
        <ellipse cx="26" cy="24" rx="14" ry="6" fill="#fff" opacity="0.9" />
        <ellipse cx="96" cy="38" rx="12" ry="5" fill="#fff" opacity="0.8" />
      </g>
    ),
    grid: (
      <g>
        <rect width="120" height="120" rx="22" fill="#1e4fb5" />
        {[20, 40, 60, 80, 100].map((v) => (
          <g key={v} stroke="#fff" strokeWidth="1" opacity="0.25">
            <path d={`M${v},0 V120`} />
            <path d={`M0,${v} H120`} />
          </g>
        ))}
      </g>
    ),
    sunset: <rect width="120" height="120" rx="22" fill={`url(#u${id})`} />,
    space: (
      <g>
        <rect width="120" height="120" rx="22" fill="#141a3d" />
        {[[18, 20], [98, 16], [104, 70], [14, 84], [34, 48], [86, 100], [60, 10]].map(([x, yy], i) => (
          <circle key={i} cx={x} cy={yy} r={i % 2 ? 1.6 : 2.4} fill="#fff" opacity="0.9" />
        ))}
        <circle cx="96" cy="96" r="9" fill="#9b51e0" opacity="0.8" />
      </g>
    ),
    confetti: (
      <g>
        <rect width="120" height="120" rx="22" fill="#fff6d2" />
        {[[16, 18, '#e2394b'], [100, 22, '#2f6bff'], [22, 96, '#33c95a'], [102, 92, '#9b51e0'], [60, 12, '#ff8a1f'], [10, 56, '#11b39e'], [110, 58, '#ffc928']].map(([x, yy, c], i) => (
          <rect key={i} x={x as number} y={yy as number} width="7" height="4" rx="1" fill={c as string} transform={`rotate(${i * 40} ${x} ${yy})`} />
        ))}
      </g>
    ),
  }

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={title ?? 'App Buddy avatar'} style={{ flex: 'none', display: 'block' }}>
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2={a.color === 'rainbow' ? '1' : '0'} y2="1">
          <stop offset="0" stopColor={c1} />
          {a.color === 'rainbow' && <stop offset="0.35" stopColor="#ffc928" />}
          {a.color === 'rainbow' && <stop offset="0.65" stopColor="#5fe07f" />}
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8ff" />
          <stop offset="1" stopColor="#d9f0ff" />
        </linearGradient>
        <linearGradient id={`u${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7b6b" />
          <stop offset="0.6" stopColor="#ffc163" />
          <stop offset="1" stopColor="#ffe9a8" />
        </linearGradient>
      </defs>
      {bg[a.bg] ?? bg.plain}
      {behind[a.extra] ?? null}
      {body[a.body] ?? body.phone}
      {eyes[a.eyes] ?? eyes.dots}
      {mouth[a.mouth] ?? mouth.smile}
      {top[a.top] ?? null}
      {front[a.extra] ?? null}
    </svg>
  )
}
