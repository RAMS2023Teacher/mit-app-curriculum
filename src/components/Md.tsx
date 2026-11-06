import { Fragment, type ReactNode } from 'react'

/** Tiny markdown subset: paragraphs, "- " bullets, "1. " lists, **bold**, `code`. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    out.push(tok.startsWith('**') ? <strong key={k++}>{tok.slice(2, -2)}</strong> : <code key={k++}>{tok.slice(1, -1)}</code>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Md({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/)
  return (
    <div className="md">
      {blocks.map((b, i) => {
        const lines = b.split('\n')
        if (lines.every((l) => /^\s*[-*] /.test(l)))
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*] /, ''))}</li>)}</ul>
        if (lines.every((l) => /^\s*\d+\. /.test(l)))
          return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+\. /, ''))}</li>)}</ol>
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
