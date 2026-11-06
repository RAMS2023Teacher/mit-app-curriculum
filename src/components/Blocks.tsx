/** Renders App Inventor-style block snippets, color-coded by the first word. */
function kind(line: string): string {
  const t = line.trim().toLowerCase()
  if (/^when\b/.test(t)) return 'event'
  if (/^set\b/.test(t)) return 'set'
  if (/^call\b/.test(t)) return 'call'
  if (/^(if|else|for each|for|while|do|then|open another screen|close screen|evaluate)\b/.test(t)) return 'control'
  if (/^(initialize|get|local)\b/.test(t)) return 'var'
  if (/^to\b/.test(t)) return 'proc'
  if (/^(result|return)\b/.test(t)) return 'proc'
  if (/^[a-z]+:/i.test(t) || /^(\+|=|\(|")/.test(t)) return 'arg'
  return 'plain'
}

export function Blocks({ lines }: { lines: string[] }) {
  return (
    <div className="blocks" role="img" aria-label={'App Inventor blocks: ' + lines.join('; ')}>
      {lines.map((l, i) => {
        const indent = l.match(/^ */)?.[0].length ?? 0
        return (
          <span key={i} className={`blk ${kind(l)}`} style={{ marginLeft: indent * 11 }}>
            {l.trim()}
          </span>
        )
      })}
    </div>
  )
}
