import JSZip from 'jszip'
import type { AiaCheck, AiaReport } from '../types'

/**
 * An App Inventor .aia file is a zip containing, per screen:
 *   src/appinventor/ai_<user>/<Project>/<Screen>.scm  → JSON component tree (wrapped in #| $JSON ... |#)
 *   src/appinventor/ai_<user>/<Project>/<Screen>.bky  → Blockly XML
 * We read both in the browser. Nothing is uploaded anywhere.
 */
export async function analyzeAia(file: File | Blob, fileName = 'project.aia'): Promise<Omit<AiaReport, 'checks'>> {
  const zip = await JSZip.loadAsync(file)
  const components: Record<string, number> = {}
  const blocks: Record<string, number> = {}
  const events = new Set<string>()
  const methods = new Set<string>()
  const screens: string[] = []
  let screenProps: Record<string, string> = {}
  let projectName = fileName.replace(/\.aia$/i, '')
  let totalBlocks = 0

  const entries = Object.values(zip.files).filter((f) => !f.dir)
  if (!entries.some((f) => f.name.endsWith('.scm'))) {
    throw new Error('This does not look like an App Inventor project. Export it with Projects → Export selected project (.aia).')
  }

  for (const entry of entries) {
    if (entry.name.endsWith('.scm')) {
      const screenName = entry.name.split('/').pop()!.replace('.scm', '')
      screens.push(screenName)
      const parts = entry.name.split('/')
      if (parts.length >= 2) projectName = parts[parts.length - 2]
      const text = await entry.async('string')
      const json = text.replace(/^#\|\s*\$JSON\s*/, '').replace(/\|#\s*$/, '')
      try {
        const data = JSON.parse(json)
        const walk = (c: { $Type?: string; $Components?: unknown[] }) => {
          if (c.$Type) components[c.$Type] = (components[c.$Type] ?? 0) + 1
          ;(c.$Components ?? []).forEach((child) => walk(child as typeof c))
        }
        if (data.Properties) {
          walk(data.Properties)
          if (screenName === 'Screen1') {
            screenProps = Object.fromEntries(
              Object.entries(data.Properties).filter(([k, v]) => !k.startsWith('$') && typeof v === 'string'),
            ) as Record<string, string>
          }
        }
      } catch {
        // A damaged screen file shouldn't stop the whole report.
      }
    } else if (entry.name.endsWith('.bky')) {
      const xml = await entry.async('string')
      if (!xml.trim()) continue
      const doc = new DOMParser().parseFromString(xml, 'text/xml')
      for (const el of Array.from(doc.getElementsByTagName('block'))) {
        if (el.getAttribute('disabled') === 'true') continue
        const type = el.getAttribute('type') ?? 'unknown'
        blocks[type] = (blocks[type] ?? 0) + 1
        totalBlocks++
        const m = el.getElementsByTagName('mutation')[0]
        if (m && m.parentElement === el) {
          const ct = m.getAttribute('component_type')
          if (type === 'component_event' && ct) events.add(`${ct}.${m.getAttribute('event_name')}`)
          if (type === 'component_method') methods.add(m.getAttribute('method_name') ?? '')
        }
      }
    }
  }

  return {
    fileName,
    projectName,
    screens: screens.sort((a, b) => (a === 'Screen1' ? -1 : b === 'Screen1' ? 1 : a.localeCompare(b))),
    components,
    blocks,
    events: [...events].sort(),
    methods: [...methods].filter(Boolean).sort(),
    screenProps,
    totalBlocks,
  }
}

export function runChecks(report: Omit<AiaReport, 'checks'>, checks: AiaCheck[]): AiaReport['checks'] {
  const comp = (t: string) => report.components[t] ?? 0
  const blk = (t: string) => report.blocks[t] ?? 0
  return checks.map((c) => {
    let passed = false
    switch (c.kind) {
      case 'component':
        passed = comp(c.type) >= (c.min ?? 1)
        break
      case 'anyComponent':
        passed = c.types.some((t) => comp(t) > 0)
        break
      case 'block':
        passed = blk(c.type) >= (c.min ?? 1)
        break
      case 'anyBlock':
        passed = c.types.some((t) => blk(t) > 0)
        break
      case 'event':
        passed = report.events.includes(`${c.component}.${c.event}`)
        break
      case 'method':
        passed = report.methods.includes(c.method)
        break
      case 'eventCount':
        passed = blk('component_event') >= c.min
        break
      case 'screens':
        passed = report.screens.length >= c.min
        break
      case 'totalBlocks':
        passed = report.totalBlocks >= c.min
        break
      case 'screenProp':
        passed = !!report.screenProps[c.prop]
        break
    }
    return { label: c.label, passed }
  })
}
