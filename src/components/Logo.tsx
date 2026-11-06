import { useId } from 'react'
import type { LogoShape, LogoSpec } from '../types'

const star = (() => {
  const pts: string[] = []
  for (let i = 0; i < 24; i++) {
    const r = i % 2 === 0 ? 48 : 40
    const a = (Math.PI * 2 * i) / 24 - Math.PI / 2
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
})()

export const SHAPES: Record<LogoShape, (props: React.SVGProps<SVGElement>) => React.ReactElement> = {
  circle: (p) => <circle cx="50" cy="50" r="46" {...(p as React.SVGProps<SVGCircleElement>)} />,
  square: (p) => <rect x="5" y="5" width="90" height="90" rx="20" {...(p as React.SVGProps<SVGRectElement>)} />,
  shield: (p) => (
    <path d="M50 4 L92 17 V47 C92 73 74 89 50 97 C26 89 8 73 8 47 V17 Z" {...(p as React.SVGProps<SVGPathElement>)} />
  ),
  hex: (p) => <polygon points="50,3 92,26 92,74 50,97 8,74 8,26" {...(p as React.SVGProps<SVGPolygonElement>)} />,
  diamond: (p) => <polygon points="50,3 97,50 50,97 3,50" {...(p as React.SVGProps<SVGPolygonElement>)} />,
  star: (p) => <polygon points={star} {...(p as React.SVGProps<SVGPolygonElement>)} />,
}

export const DEFAULT_LOGO: LogoSpec = {
  shape: 'circle',
  bg: '#3a5bff',
  fg: '#ffffff',
  ring: '#ffb400',
  icon: '🚀',
  initials: '',
  pattern: 'none',
}

/** Company logo as an SVG <g> so it can be placed inside other SVGs (the tree). */
export function LogoGlyph({ logo, size, x = 0, y = 0 }: { logo: LogoSpec; size: number; x?: number; y?: number }) {
  const uid = useId().replace(/:/g, '')
  const Shape = SHAPES[logo.shape] ?? SHAPES.circle
  const hasIcon = !!logo.icon
  const hasText = !!logo.initials
  return (
    <g transform={`translate(${x},${y}) scale(${size / 100})`}>
      <defs>
        <clipPath id={`clip-${uid}`}>
          <Shape />
        </clipPath>
      </defs>
      <Shape fill={logo.bg} />
      <g clipPath={`url(#clip-${uid})`}>
        {logo.pattern === 'stripes' &&
          Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={i * 22 - 60} y="-20" width="9" height="160" fill={logo.fg} opacity="0.13" transform="rotate(30 50 50)" />
          ))}
        {logo.pattern === 'dots' &&
          Array.from({ length: 36 }, (_, i) => (
            <circle key={i} cx={(i % 6) * 18 + 5} cy={Math.floor(i / 6) * 18 + 5} r="3.2" fill={logo.fg} opacity="0.16" />
          ))}
        {logo.pattern === 'split' && <rect x="50" y="0" width="60" height="100" fill={logo.ring} opacity="0.35" />}
      </g>
      <Shape fill="none" stroke={logo.ring} strokeWidth="6" />
      {hasIcon && (
        <text x="50" y={hasText ? 50 : 54} fontSize={hasText ? 38 : 48} textAnchor="middle" dominantBaseline="middle">
          {logo.icon}
        </text>
      )}
      {hasText && (
        <text
          x="50"
          y={hasIcon ? 79 : 53}
          fontSize={hasIcon ? 17 : 36}
          fontWeight="700"
          fontFamily="Fredoka, Inter, sans-serif"
          fill={logo.fg}
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="1"
        >
          {logo.initials.slice(0, 3).toUpperCase()}
        </text>
      )}
    </g>
  )
}

export function Logo({ logo, size = 48, title }: { logo: LogoSpec; size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title ?? 'Company logo'} style={{ flex: 'none' }}>
      {title && <title>{title}</title>}
      <LogoGlyph logo={logo} size={size} />
    </svg>
  )
}
