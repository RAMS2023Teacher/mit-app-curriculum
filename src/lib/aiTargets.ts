import type { LessonStep } from '../types'

/** A place in the App Inventor window that a step tells students to find. */
export type AiTarget =
  | { kind: 'menu'; menu: 'Projects' | 'Connect' | 'Build'; item: string }
  | { kind: 'palette'; category: string; component?: string }
  | { kind: 'drawer'; drawer: string }
  | { kind: 'area'; area: 'properties' | 'components' | 'rename' | 'upload' | 'add-screen' | 'toggle-blocks' | 'toggle-designer' | 'warnings' | 'component-blocks' }

export const MENUS: Record<'Projects' | 'Connect' | 'Build', string[]> = {
  Projects: [
    'My projects',
    'Start new project',
    'Import project (.aia) from my computer',
    'Save project',
    'Save project as…',
    'Checkpoint',
    'Export selected project (.aia) to my computer',
  ],
  Connect: ['AI Companion', 'Emulator', 'USB', 'Refresh Companion Screen', 'Reset Connection'],
  Build: ['Android App (.apk)', 'Android App Bundle (.aab)'],
}

export const PALETTE: Record<string, string[]> = {
  'User Interface': ['Button', 'CheckBox', 'DatePicker', 'Image', 'Label', 'ListPicker', 'ListView', 'Notifier', 'Slider', 'Spinner', 'TextBox'],
  Layout: ['HorizontalArrangement', 'VerticalArrangement', 'TableArrangement', 'HorizontalScrollArrangement'],
  Media: ['Camera', 'ImagePicker', 'Player', 'Sound', 'SoundRecorder', 'TextToSpeech', 'VideoPlayer'],
  'Drawing and Animation': ['Ball', 'Canvas', 'ImageSprite'],
  Maps: ['Map', 'Marker', 'Circle', 'Navigation'],
  Sensors: ['AccelerometerSensor', 'Clock', 'LocationSensor', 'OrientationSensor', 'Pedometer'],
  Social: ['ContactPicker', 'PhoneCall', 'Sharing', 'Texting'],
  Storage: ['File', 'TinyDB', 'TinyWebDB'],
}

export const DRAWERS: { name: string; color: string }[] = [
  { name: 'Control', color: '#c88330' },
  { name: 'Logic', color: '#77ab41' },
  { name: 'Math', color: '#3f71b5' },
  { name: 'Text', color: '#b32d5e' },
  { name: 'Lists', color: '#49a6d4' },
  { name: 'Dictionaries', color: '#2d1799' },
  { name: 'Colors', color: '#7d7d7d' },
  { name: 'Variables', color: '#d05f2d' },
  { name: 'Procedures', color: '#7c5385' },
]

const key = (t: AiTarget) => JSON.stringify(t)

/** Reads a step's words and finds the App Inventor places it mentions (at most 3). */
export function findTargets(step: LessonStep): AiTarget[] {
  const text = `${step.title}\n${step.body}`.replace(/\*\*/g, '')
  const out: AiTarget[] = []
  const add = (t: AiTarget) => {
    if (!out.some((o) => key(o) === key(t))) out.push(t)
  }

  // Menus: "Projects → Export selected project", "Connect → AI Companion", "Build → Android App"
  for (const m of text.matchAll(/\b(Projects|Connect|Build)\s*(?:→|->|>)\s*([A-Za-z][A-Za-z .()…]+)/g)) {
    const menu = m[1] as 'Projects' | 'Connect' | 'Build'
    const said = m[2].toLowerCase()
    // Pick the menu item sharing the longest start with what the step says.
    const common = (a: string, b: string) => {
      let n = 0
      while (n < a.length && n < b.length && a[n] === b[n]) n++
      return n
    }
    const best = MENUS[menu]
      .map((i) => ({ i, n: common(i.toLowerCase().replace('…', '...'), said) }))
      .sort((a, b) => b.n - a.n)[0]
    const item = best && best.n >= 5 ? best.i : undefined
    if (item) add({ kind: 'menu', menu, item })
  }

  // Palette categories, and a component in that category if the step names one.
  for (const cat of Object.keys(PALETTE)) {
    const re = new RegExp(`(Palette\\s*(→|->)\\s*${cat}|${cat}\\s+drawer|${cat}\\s*(→|->)|\\(${cat}\\)|${cat} category|${cat} section)`, 'i')
    if (cat === 'User Interface' ? /User Interface/i.test(text) : re.test(text)) {
      const after = text.slice(text.search(new RegExp(cat, 'i')))
      const component = PALETTE[cat].find((c) => new RegExp(`\\b${c}\\b`).test(after.slice(0, 160)))
      add({ kind: 'palette', category: cat, component })
    }
  }

  // Built-in blocks drawers: "Math drawer", "from the Text drawer"
  for (const d of DRAWERS) if (new RegExp(`\\b${d.name}\\s+drawer`, 'i').test(text)) add({ kind: 'drawer', drawer: d.name })

  if (/Upload File/i.test(text)) add({ kind: 'area', area: 'upload' })
  if (/Add Screen/i.test(text)) add({ kind: 'area', area: 'add-screen' })
  if (/Show Warnings/i.test(text)) add({ kind: 'area', area: 'warnings' })
  if (/\bRename\b/.test(text)) add({ kind: 'area', area: 'rename' })
  if (/\bProperties\b/i.test(text) && step.editor !== 'blocks') add({ kind: 'area', area: 'properties' })
  if (/click\s+(the\s+)?Blocks\b|\bBlocks\s+button|top-right/i.test(text)) add({ kind: 'area', area: 'toggle-blocks' })
  if (step.editor === 'blocks' && !out.some((t) => t.kind === 'drawer') && /\bclick\s+[A-Z][A-Za-z]*[0-9]\b|in the left panel/i.test(text))
    add({ kind: 'area', area: 'component-blocks' })

  return out.slice(0, 3)
}

/** Short caption for a target, e.g. "Palette → Media → TextToSpeech". */
export function targetLabel(t: AiTarget): string {
  switch (t.kind) {
    case 'menu':
      return `${t.menu} → ${t.item}`
    case 'palette':
      return `Palette → ${t.category}${t.component ? ` → ${t.component}` : ''}`
    case 'drawer':
      return `Blocks → ${t.drawer} drawer`
    case 'area':
      return {
        properties: 'Properties panel (right side of the Designer)',
        components: 'Components panel',
        rename: 'Components panel → Rename',
        upload: 'Media → Upload File…',
        'add-screen': 'Add Screen… (above the phone)',
        'toggle-blocks': 'The Blocks button (top right)',
        'toggle-designer': 'The Designer button (top right)',
        warnings: 'Show Warnings (bottom left of the Blocks editor)',
        'component-blocks': 'Your components, listed under Screen1 in the Blocks panel',
      }[t.area]
  }
}
