import type { AiaReport } from '../types'

export function AiaReportView({ report, compact }: { report: AiaReport; compact?: boolean }) {
  const passed = report.checks.filter((c) => c.passed).length
  const visible = Object.entries(report.components)
    .filter(([t]) => t !== 'Form')
    .sort((a, b) => b[1] - a[1])
  return (
    <div>
      <div className="row small" style={{ marginBottom: 6 }}>
        <span className={`chip ${passed === report.checks.length ? 'good' : 'warn'}`}>
          {passed}/{report.checks.length} checks passed
        </span>
        <span className="muted">
          📦 {report.projectName} · {report.screens.length} screen{report.screens.length === 1 ? '' : 's'} · {report.totalBlocks} blocks
        </span>
      </div>
      <ul className="check-list small">
        {report.checks.map((c) => (
          <li key={c.label}>
            <span>{c.passed ? '✅' : '❌'}</span> {c.label}
          </li>
        ))}
      </ul>
      {!compact && (
        <details className="small" style={{ marginTop: 6 }}>
          <summary>What's inside the project</summary>
          <p style={{ margin: '6px 0' }}>
            <strong>Components:</strong> {visible.map(([t, n]) => `${t}${n > 1 ? ` ×${n}` : ''}`).join(', ') || 'none'}
          </p>
          <p style={{ margin: '6px 0' }}>
            <strong>Events:</strong> {report.events.join(', ') || 'none'}
          </p>
          <p style={{ margin: '6px 0' }}>
            <strong>Methods called:</strong> {report.methods.join(', ') || 'none'}
          </p>
        </details>
      )}
    </div>
  )
}
