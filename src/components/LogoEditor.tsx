import type { LogoShape, LogoSpec } from '../types'
import { Logo, SHAPES } from './Logo'

const COLORS = ['#3a5bff', '#1d3557', '#e63946', '#ff006e', '#f08a24', '#ffd166', '#06d6a0', '#12a594', '#7b2cbf', '#8e4ec6', '#073b4c', '#111111', '#ffffff', '#f1faee']
const ICONS = ['🚀', '⚡', '🔥', '🌟', '🦄', '🐉', '🦙', '🐙', '🦊', '🐺', '🦅', '🐝', '🏴‍☠️', '👾', '🎮', '🎲', '🎧', '🎨', '📸', '🎬', '🛠️', '🧠', '💡', '🔮', '🌈', '🌊', '🍕', '🌮', '🍩', '⚽', '🏀', '🎯', '💎', '👑', '🤖', '🛸', '🌵', '🍀', '☕', '']

export function LogoEditor({ value, onChange }: { value: LogoSpec; onChange: (l: LogoSpec) => void }) {
  const set = <K extends keyof LogoSpec>(k: K, v: LogoSpec[K]) => onChange({ ...value, [k]: v })
  const swatches = (k: 'bg' | 'fg' | 'ring') => (
    <div className="swatches">
      {COLORS.map((c) => (
        <button
          key={c}
          type="button"
          className={`swatch ${value[k] === c ? 'on' : ''}`}
          style={{ background: c }}
          aria-label={`Color ${c}`}
          onClick={() => set(k, c)}
        />
      ))}
      <input type="color" value={value[k]} onChange={(e) => set(k, e.target.value)} style={{ width: 36, height: 28, padding: 0 }} aria-label="Custom color" />
    </div>
  )
  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(160px, 200px) 1fr', alignItems: 'start' }}>
      <div className="center card flat" style={{ padding: 16 }}>
        <Logo logo={value} size={150} />
        <div className="small muted" style={{ marginTop: 8 }}>
          This is how your company appears on the tree
        </div>
      </div>
      <div>
        <label className="field">
          <span>Shape</span>
          <div className="row" style={{ gap: 6 }}>
            {(Object.keys(SHAPES) as LogoShape[]).map((s) => (
              <button type="button" key={s} className={`pick ${value.shape === s ? 'on' : ''}`} onClick={() => set('shape', s)} aria-label={s} title={s}>
                <Logo logo={{ ...value, shape: s, icon: '', initials: '', pattern: 'none' }} size={28} />
              </button>
            ))}
          </div>
        </label>
        <label className="field">
          <span>Icon</span>
          <div className="emoji-grid">
            {ICONS.map((i) => (
              <button type="button" key={i || 'none'} className={`pick ${value.icon === i ? 'on' : ''}`} onClick={() => set('icon', i)}>
                {i || <span className="small muted">none</span>}
              </button>
            ))}
          </div>
        </label>
        <div className="grid cols-2" style={{ gap: 12 }}>
          <label className="field">
            <span>Initials (up to 3)</span>
            <input maxLength={3} value={value.initials} onChange={(e) => set('initials', e.target.value.toUpperCase())} />
          </label>
          <label className="field">
            <span>Pattern</span>
            <select value={value.pattern} onChange={(e) => set('pattern', e.target.value as LogoSpec['pattern'])}>
              <option value="none">None</option>
              <option value="stripes">Stripes</option>
              <option value="dots">Dots</option>
              <option value="split">Split</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span>Background</span>
          {swatches('bg')}
        </label>
        <label className="field">
          <span>Border</span>
          {swatches('ring')}
        </label>
        <label className="field">
          <span>Text &amp; pattern</span>
          {swatches('fg')}
        </label>
      </div>
    </div>
  )
}
