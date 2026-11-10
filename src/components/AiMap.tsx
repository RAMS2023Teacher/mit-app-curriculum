import type { ReactElement } from 'react'
import { DRAWERS, MENUS, PALETTE, targetLabel, type AiTarget } from '../lib/aiTargets'

/**
 * A simplified drawing of the MIT App Inventor window with one spot circled.
 * Not a screenshot: App Inventor's look changes between versions, so this shows
 * the layout (where things are), which stays the same.
 */

const W = 760
const H = 430
const TOP = 36 // menu bar height
const BAR = 70 // bottom of the project bar
const C = {
  frame: '#1b2350',
  bar: '#eef0f3',
  barText: '#2b2f3a',
  panel: '#ffffff',
  panelHead: '#e3e8ef',
  line: '#c9d2df',
  text: '#33384a',
  dim: '#8a93a6',
  green: '#7cb342',
  hi: '#ff3b30',
}
const MENU_X: Record<string, number> = { Projects: 170, Connect: 250, Build: 330, Settings: 400, Help: 480 }

type Rect = { x: number; y: number; w: number; h: number }

function Text({ x, y, children, size = 12, weight = 600, fill = C.text, anchor = 'start' as 'start' | 'middle' | 'end' }: { x: number; y: number; children: string; size?: number; weight?: number; fill?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontFamily="Nunito, Arial, sans-serif">
      {children}
    </text>
  )
}

function Chrome({ view }: { view: 'designer' | 'blocks' }) {
  return (
    <g>
      <rect x={0} y={0} width={W} height={TOP} fill={C.bar} />
      <rect x={10} y={8} width={20} height={20} rx={4} fill={C.green} />
      <Text x={36} y={23} size={13} weight={800}>
        MIT App Inventor
      </Text>
      {Object.entries(MENU_X).map(([m, x]) => (
        <Text key={m} x={x} y={23} size={13}>
          {`${m} ▾`}
        </Text>
      ))}
      <Text x={W - 12} y={23} size={11} fill={C.dim} anchor="end">
        My Projects · Guide · Report an Issue
      </Text>
      <rect x={0} y={TOP} width={W} height={BAR - TOP} fill="#f7f8fa" stroke={C.line} />
      <Text x={12} y={58} size={13} weight={800}>
        MyApp
      </Text>
      <rect x={80} y={44} width={84} height={20} rx={4} fill="#fff" stroke={C.line} />
      <Text x={88} y={58} size={11}>
        Screen1 ▾
      </Text>
      <rect x={172} y={44} width={86} height={20} rx={4} fill="#fff" stroke={C.line} />
      <Text x={180} y={58} size={11}>
        Add Screen…
      </Text>
      <rect x={266} y={44} width={98} height={20} rx={4} fill="#fff" stroke={C.line} />
      <Text x={274} y={58} size={11}>
        Remove Screen
      </Text>
      <rect x={608} y={44} width={70} height={20} rx={4} fill={view === 'designer' ? C.green : '#fff'} stroke={C.line} />
      <Text x={643} y={58} size={11} anchor="middle" fill={view === 'designer' ? '#fff' : C.text}>
        Designer
      </Text>
      <rect x={682} y={44} width={66} height={20} rx={4} fill={view === 'blocks' ? C.green : '#fff'} stroke={C.line} />
      <Text x={715} y={58} size={11} anchor="middle" fill={view === 'blocks' ? '#fff' : C.text}>
        Blocks
      </Text>
    </g>
  )
}

function PanelHead({ x, w, title }: { x: number; w: number; title: string }) {
  return (
    <g>
      <rect x={x} y={BAR + 6} width={w} height={22} fill={C.panelHead} />
      <Text x={x + 8} y={BAR + 21} size={12} weight={800}>
        {title}
      </Text>
    </g>
  )
}

/** Designer: Palette | Viewer | Components | Properties. Returns rects of interesting spots. */
function Designer({ open }: { open: string }) {
  const rows: ReactElement[] = []
  const spots: Record<string, Rect> = {}
  let y = BAR + 56
  for (const cat of Object.keys(PALETTE)) {
    const isOpen = cat === open
    spots['cat:' + cat] = { x: 4, y: y - 14, w: 162, h: 20 }
    rows.push(
      <g key={cat}>
        <rect x={4} y={y - 14} width={162} height={20} fill={isOpen ? '#dfeccd' : '#f3f5f8'} />
        <Text x={10} y={y} size={11} weight={800}>
          {`${isOpen ? '▾' : '▸'} ${cat}`}
        </Text>
      </g>,
    )
    y += 22
    if (isOpen) {
      for (const comp of PALETTE[cat].slice(0, 7)) {
        spots['comp:' + comp] = { x: 10, y: y - 13, w: 150, h: 18 }
        rows.push(
          <g key={cat + comp}>
            <rect x={14} y={y - 10} width={10} height={10} rx={2} fill={C.dim} />
            <Text x={30} y={y} size={11} weight={600}>
              {comp}
            </Text>
          </g>,
        )
        y += 19
      }
      y += 4
    }
  }
  spots.palette = { x: 0, y: BAR + 4, w: 170, h: H - BAR - 8 }
  spots.components = { x: 435, y: BAR + 4, w: 155, h: 220 }
  spots.rename = { x: 442, y: 290, w: 60, h: 22 }
  spots.upload = { x: 442, y: 372, w: 140, h: 24 }
  spots.properties = { x: 595, y: BAR + 4, w: 162, h: H - BAR - 8 }
  spots['add-screen'] = { x: 172, y: 44, w: 86, h: 20 }
  spots['toggle-blocks'] = { x: 682, y: 44, w: 66, h: 20 }
  spots['toggle-designer'] = { x: 608, y: 44, w: 70, h: 20 }
  return {
    spots,
    el: (
      <g>
        {/* Palette */}
        <rect x={0} y={BAR + 4} width={170} height={H - BAR - 8} fill={C.panel} stroke={C.line} />
        <PanelHead x={0} w={170} title="Palette" />
        <rect x={6} y={BAR + 32} width={158} height={16} rx={3} fill="#fff" stroke={C.line} />
        <Text x={12} y={BAR + 44} size={10} fill={C.dim}>
          Search Components…
        </Text>
        {rows}
        {/* Viewer */}
        <rect x={175} y={BAR + 4} width={255} height={H - BAR - 8} fill={C.panel} stroke={C.line} />
        <PanelHead x={175} w={255} title="Viewer" />
        <rect x={250} y={BAR + 40} width={110} height={200} rx={14} fill="#f7f8fa" stroke={C.frame} strokeWidth={2} />
        <rect x={258} y={BAR + 58} width={94} height={150} fill="#fff" stroke={C.line} />
        <rect x={270} y={BAR + 72} width={70} height={18} rx={3} fill="#e0e0e0" stroke={C.line} />
        <Text x={305} y={BAR + 85} size={10} anchor="middle">
          Button1
        </Text>
        <Text x={302} y={BAR + 260} size={10} anchor="middle" fill={C.dim}>
          Non-visible components
        </Text>
        {/* Components */}
        <rect x={435} y={BAR + 4} width={155} height={H - BAR - 8} fill={C.panel} stroke={C.line} />
        <PanelHead x={435} w={155} title="Components" />
        {['▾ Screen1', '    Button1', '    Label1', '    TextBox1'].map((t, i) => (
          <Text key={t} x={442} y={BAR + 48 + i * 20} size={11} weight={i ? 600 : 800}>
            {t}
          </Text>
        ))}
        <rect x={442} y={290} width={60} height={22} rx={4} fill="#fff" stroke={C.line} />
        <Text x={472} y={305} size={11} anchor="middle">
          Rename
        </Text>
        <rect x={508} y={290} width={60} height={22} rx={4} fill="#fff" stroke={C.line} />
        <Text x={538} y={305} size={11} anchor="middle">
          Delete
        </Text>
        <rect x={435} y={330} width={155} height={22} fill={C.panelHead} />
        <Text x={443} y={345} size={12} weight={800}>
          Media
        </Text>
        <rect x={442} y={372} width={140} height={24} rx={4} fill="#fff" stroke={C.line} />
        <Text x={512} y={388} size={11} anchor="middle">
          Upload File …
        </Text>
        {/* Properties */}
        <rect x={595} y={BAR + 4} width={162} height={H - BAR - 8} fill={C.panel} stroke={C.line} />
        <PanelHead x={595} w={162} title="Properties" />
        <Text x={602} y={BAR + 46} size={11} weight={800}>
          Button1 (Button)
        </Text>
        {['BackgroundColor', 'Enabled', 'FontSize', 'Height', 'Width', 'Image', 'Text', 'TextColor', 'Visible'].map((p, i) => (
          <g key={p}>
            <Text x={602} y={BAR + 70 + i * 26} size={10} fill={C.dim}>
              {p}
            </Text>
            <rect x={602} y={BAR + 74 + i * 26} width={140} height={10} rx={2} fill="#f3f5f8" stroke={C.line} />
          </g>
        ))}
      </g>
    ),
  }
}

/** Blocks editor: built-in drawers + components on the left, workspace on the right. */
function BlocksView() {
  const spots: Record<string, Rect> = {}
  let y = BAR + 72
  const drawerRows = DRAWERS.map((d) => {
    const row = (
      <g key={d.name}>
        <rect x={16} y={y - 10} width={12} height={12} rx={2} fill={d.color} />
        <Text x={34} y={y} size={11}>
          {d.name}
        </Text>
      </g>
    )
    spots['drawer:' + d.name] = { x: 10, y: y - 14, w: 170, h: 19 }
    y += 19
    return row
  })
  const compTop = y + 4
  spots['component-blocks'] = { x: 6, y: compTop + 4, w: 178, h: 82 }
  spots.warnings = { x: 202, y: H - 40, w: 210, h: 28 }
  return {
    spots,
    el: (
      <g>
        <rect x={0} y={BAR + 4} width={190} height={H - BAR - 8} fill={C.panel} stroke={C.line} />
        <PanelHead x={0} w={190} title="Blocks" />
        <Text x={8} y={BAR + 46} size={11} weight={800}>
          ▾ Built-in
        </Text>
        {drawerRows}
        <Text x={8} y={compTop + 18} size={11} weight={800}>
          ▾ Screen1
        </Text>
        {['Button1', 'Label1', 'TextBox1'].map((t, i) => (
          <Text key={t} x={24} y={compTop + 38 + i * 18} size={11}>
            {t}
          </Text>
        ))}
        <Text x={8} y={compTop + 104} size={11} weight={800}>
          ▸ Any component
        </Text>
        <rect x={195} y={BAR + 4} width={W - 198} height={H - BAR - 8} fill="#fbfbfd" stroke={C.line} />
        <pattern id="aigrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#dde2ea" />
        </pattern>
        <rect x={196} y={BAR + 5} width={W - 200} height={H - BAR - 10} fill="url(#aigrid)" />
        <rect x={300} y={BAR + 60} width={200} height={24} rx={8} fill="#c88330" />
        <Text x={310} y={BAR + 77} size={12} weight={800} fill="#fff">
          when Button1.Click do
        </Text>
        <rect x={318} y={BAR + 86} width={190} height={22} rx={4} fill="#266643" />
        <Text x={326} y={BAR + 101} size={11} weight={700} fill="#fff">
          set Label1.Text to "Hi!"
        </Text>
        <rect x={300} y={BAR + 110} width={60} height={10} rx={4} fill="#c88330" />
        <Text x={W - 30} y={H - 20} size={22} anchor="middle">
          🗑
        </Text>
        <rect x={202} y={H - 40} width={210} height={28} rx={6} fill="#fff" stroke={C.line} />
        <Text x={212} y={H - 21} size={11}>
          ⚠ 0   ✖ 0   Show Warnings
        </Text>
      </g>
    ),
  }
}

function MenuDrop({ menu, item }: { menu: keyof typeof MENUS; item: string }) {
  const x = MENU_X[menu] - 6
  const items = MENUS[menu]
  const w = 290
  const spot: Rect = { x, y: TOP + 4 + items.indexOf(item) * 24, w, h: 24 }
  return {
    spot,
    el: (
      <g>
        <rect x={0} y={TOP} width={W} height={H - TOP} fill="#1b2350" opacity={0.18} />
        <rect x={MENU_X[menu] - 8} y={6} width={menu.length * 8 + 28} height={24} rx={4} fill="#dfeccd" />
        <Text x={MENU_X[menu]} y={23} size={13} weight={800}>
          {`${menu} ▾`}
        </Text>
        <rect x={x} y={TOP + 2} width={w} height={items.length * 24 + 6} rx={6} fill="#fff" stroke={C.frame} strokeWidth={1.5} />
        {items.map((it, i) => (
          <Text key={it} x={x + 12} y={TOP + 21 + i * 24} size={12} weight={it === item ? 800 : 600}>
            {it}
          </Text>
        ))}
      </g>
    ),
  }
}

export function AiMap({ target }: { target: AiTarget }) {
  const view = target.kind === 'drawer' || (target.kind === 'area' && (target.area === 'warnings' || target.area === 'component-blocks')) ? 'blocks' : 'designer'
  const openCat = target.kind === 'palette' ? target.category : 'User Interface'
  const designer = Designer({ open: openCat })
  const blocks = BlocksView()
  const menu = target.kind === 'menu' ? MenuDrop({ menu: target.menu, item: target.item }) : null

  let spot: Rect | undefined
  if (menu) spot = menu.spot
  else if (target.kind === 'palette') spot = (target.component && designer.spots['comp:' + target.component]) || designer.spots['cat:' + target.category]
  else if (target.kind === 'drawer') spot = blocks.spots['drawer:' + target.drawer]
  else if (target.kind === 'area') spot = view === 'blocks' ? blocks.spots[target.area] : designer.spots[target.area]

  const label = targetLabel(target)
  return (
    <figure className="aimap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Simplified App Inventor window. Find: ${label}`}>
        <rect x={0} y={0} width={W} height={H} rx={10} fill="#fff" />
        <Chrome view={view} />
        {view === 'designer' ? designer.el : blocks.el}
        {menu?.el}
        {spot && (
          <g>
            <rect x={spot.x - 9} y={spot.y - 9} width={spot.w + 18} height={spot.h + 18} rx={12} fill="none" stroke={C.hi} strokeWidth={6} className="pulse" />
            <rect x={spot.x - 4} y={spot.y - 4} width={spot.w + 8} height={spot.h + 8} rx={8} fill="none" stroke={C.hi} strokeWidth={3.5} />
          </g>
        )}
        <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={10} fill="none" stroke={C.frame} strokeWidth={2} />
      </svg>
      <figcaption>
        <strong>🔍 Find:</strong> {label}
      </figcaption>
    </figure>
  )
}
