'use client'

import { useStore } from '@/lib/context'
import { CATEGORY_LABELS } from '@/lib/obligations-data'
import { Download, FileText, Shield, CheckCircle2, Clock, Circle, AlertTriangle } from 'lucide-react'

function generatePDF(data: ReturnType<typeof useStore>, CATEGORY_LABELS: Record<string, string>) {
  const { orgName, isSdf, score, complianceStats, relevantObligations, statuses, notes, assignees, rights, breaches } = data

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>DPDP Compliance Audit Report - ${orgName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #1a1a2e; line-height: 1.5; }
  .page { padding: 48px; max-width: 800px; margin: 0 auto; }
  .header { border-bottom: 2px solid #f59e0b; padding-bottom: 24px; margin-bottom: 32px; }
  .logo { font-size: 11px; color: #666; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; }
  h1 { font-size: 26px; font-weight: 700; color: #0a0a1a; margin-bottom: 4px; }
  .subtitle { font-size: 13px; color: #666; }
  .meta { display: flex; gap: 24px; margin-top: 16px; }
  .meta-item { font-size: 11px; color: #888; }
  .meta-item strong { color: #333; display: block; font-size: 12px; }
  .section { margin-bottom: 32px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f59e0b; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
  .score-row { display: flex; gap: 16px; margin-bottom: 24px; }
  .score-card { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
  .score-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
  .score-value { font-size: 24px; font-weight: 700; }
  .score-main { font-size: 36px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #f3f4f6; padding: 8px 10px; text-align: left; font-weight: 600; color: #555; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 9px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .status-done { color: #059669; font-weight: 600; }
  .status-in_progress { color: #2563eb; font-weight: 600; }
  .status-pending { color: #9ca3af; }
  .status-not_applicable { color: #d1d5db; }
  .tier-critical { color: #dc2626; font-weight: 600; }
  .tier-high { color: #ea580c; font-weight: 600; }
  .tier-medium { color: #d97706; }
  .tier-low { color: #16a34a; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
  .badge-sdf { background: #f3e8ff; color: #7c3aed; }
  .badge-std { background: #f0fdf4; color: #16a34a; }
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; display: flex; justify-content: space-between; }
  .alert { background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 11px; color: #92400e; }
  .cat-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .cat-row:last-child { border-bottom: none; }
  .progress { height: 4px; background: #e5e7eb; border-radius: 2px; margin-top: 4px; overflow: hidden; }
  .progress-fill { height: 100%; background: #f59e0b; border-radius: 2px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">DPDP Compliance Tracker</div>
    <h1>${orgName}</h1>
    <div class="subtitle">Digital Personal Data Protection Act 2023 &amp; Rules 2025 - Compliance Audit Report</div>
    <div class="meta">
      <div class="meta-item"><strong>${dateStr}</strong>Report date</div>
      <div class="meta-item"><strong>${isSdf ? 'Significant Data Fiduciary' : 'Data Fiduciary'}</strong>Classification</div>
      <div class="meta-item"><strong>${score}%</strong>Compliance score</div>
      <div class="meta-item"><strong>${complianceStats.done} / ${complianceStats.total}</strong>Obligations completed</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Executive summary</div>
    <div class="score-row">
      <div class="score-card">
        <div class="score-label">Overall compliance score</div>
        <div class="score-value score-main" style="color: ${score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'}">${score}%</div>
      </div>
      <div class="score-card">
        <div class="score-label">Completed</div>
        <div class="score-value" style="color:#059669">${complianceStats.done}</div>
      </div>
      <div class="score-card">
        <div class="score-label">In progress</div>
        <div class="score-value" style="color:#2563eb">${complianceStats.in_progress}</div>
      </div>
      <div class="score-card">
        <div class="score-label">Pending</div>
        <div class="score-value" style="color:#dc2626">${complianceStats.pending}</div>
      </div>
    </div>
    ${complianceStats.critical_pending > 0 ? `
    <div class="alert">
      ⚠ ${complianceStats.critical_pending} critical obligation${complianceStats.critical_pending > 1 ? 's' : ''} with up to ₹250 crore penalty exposure remain${complianceStats.critical_pending === 1 ? 's' : ''} unaddressed.
    </div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">Compliance by category</div>
    <div>
      ${Object.entries(relevantObligations.reduce<Record<string, { total: number; done: number }>>((acc, o) => {
        if (!acc[o.category]) acc[o.category] = { total: 0, done: 0 }
        acc[o.category].total++
        if (statuses[o.id] === 'done' || statuses[o.id] === 'not_applicable') acc[o.category].done++
        return acc
      }, {})).map(([cat, { total, done }]) => {
        const pct = Math.round((done / total) * 100)
        return `
        <div class="cat-row">
          <div style="flex:1">
            <div style="font-size:11px;color:#333;font-weight:500">${CATEGORY_LABELS[cat] ?? cat}</div>
            <div class="progress"><div class="progress-fill" style="width:${pct}%;background:${pct===100?'#059669':'#f59e0b'}"></div></div>
          </div>
          <div style="margin-left:16px;font-size:11px;color:#666;white-space:nowrap">${done}/${total} (${pct}%)</div>
        </div>`
      }).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Full obligations register</div>
    <table>
      <thead><tr><th>Obligation</th><th>Section</th><th>Risk</th><th>Phase</th><th>Status</th><th>Assignee</th></tr></thead>
      <tbody>
        ${relevantObligations.map(o => {
          const status = statuses[o.id] ?? 'pending'
          const statusLabel = { done: 'Done', in_progress: 'In progress', pending: 'Pending', not_applicable: 'N/A' }[status]
          return `<tr>
            <td style="max-width:240px">${o.title}${notes[o.id] ? `<div style="color:#9ca3af;font-size:10px;margin-top:2px">${notes[o.id]}</div>` : ''}</td>
            <td style="white-space:nowrap;color:#666">${o.section_reference}</td>
            <td class="tier-${o.penalty_tier}">${o.penalty_tier.charAt(0).toUpperCase() + o.penalty_tier.slice(1)}</td>
            <td style="color:#666">${o.phase === 2 ? 'Phase 2 · 13 Nov 2026' : o.phase === 3 ? 'Phase 3 · 13 May 2027' : 'Phase 4 · SDF notification'}</td>
            <td class="status-${status}">${statusLabel}</td>
            <td style="color:#666">${assignees[o.id] ?? ''}</td>
          </tr>`
        }).join('')}
      </tbody>
    </table>
  </div>

  ${rights.length > 0 ? `
  <div class="section">
    <div class="section-title">Data Principal rights requests</div>
    <table>
      <thead><tr><th>Principal</th><th>Type</th><th>Received</th><th>Deadline</th><th>Status</th></tr></thead>
      <tbody>
        ${rights.map(r => `<tr>
          <td>${r.principal_name}${r.principal_email ? `<div style="color:#9ca3af;font-size:10px">${r.principal_email}</div>` : ''}</td>
          <td>${r.type}</td>
          <td>${r.date_received}</td>
          <td style="color:${r.date_responded ? new Date(r.date_responded) : new Date() < new Date() && r.status !== 'responded' && r.status !== 'closed' ? '#dc2626' : '#333'}">${r.date_responded}</td>
          <td>${r.status}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  ${breaches.length > 0 ? `
  <div class="section">
    <div class="section-title">Personal data breach log</div>
    <table>
      <thead><tr><th>Incident</th><th>Discovered</th><th>Board notified</th><th>Status</th></tr></thead>
      <tbody>
        ${breaches.map(b => `<tr>
          <td>${b.title}${b.description ? `<div style="color:#9ca3af;font-size:10px">${b.description}</div>` : ''}</td>
          <td>${b.date_discovered}</td>
          <td style="color:${!b.date_notified_board_detailed ? '#dc2626' : '#059669'}">${b.date_notified_board_detailed ?? 'Not yet notified'}</td>
          <td>${b.status}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>` : ''}

  <div class="footer">
    <span>Generated by DPDP Compliance Tracker · ${dateStr}</span>
    <span>This report is for internal compliance purposes only and does not constitute legal advice.</span>
  </div>
</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `DPDP-Audit-${orgName.replace(/\s+/g, '-')}-${now.toISOString().split('T')[0]}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AuditPage() {
  const store = useStore()
  const { orgName, isSdf, score, complianceStats, relevantObligations, statuses, rights, breaches } = store

  const criticalPending = relevantObligations.filter(o => o.penalty_tier === 'critical' && (!statuses[o.id] || statuses[o.id] === 'pending'))
  const overdueRights = rights.filter(r => r.status !== 'responded' && r.status !== 'closed' && r.date_responded ? new Date(r.date_responded) : new Date() < new Date())
  const unreportedBreaches = breaches.filter(b => b.status === 'discovered')

  return (
    <div className="page">
      <h1 className="page-title">Audit export</h1>
      <p className="page-sub">Generate a board-ready compliance report for {orgName}</p>

      {/* Summary preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Compliance score</div>
          <div className="stat-value" style={{ color: score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)', fontSize: 36 }}>{score}%</div>
          <div className="progress-bar" style={{ marginTop: 10 }}>
            <div className="progress-fill" style={{ width: `${score}%`, background: score >= 80 ? 'var(--green)' : 'var(--amber)' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Done</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{complianceStats.done}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In progress</div>
          <div className="stat-value" style={{ color: 'var(--blue)' }}>{complianceStats.in_progress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{complianceStats.pending}</div>
        </div>
      </div>

      {/* Issues to flag */}
      {(criticalPending.length > 0 || overdueRights.length > 0 || unreportedBreaches.length > 0) && (
        <div className="card" style={{ padding: 20, marginBottom: 24, borderColor: 'var(--red-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertTriangle size={14} color="var(--red)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fca5a5' }}>Items that will be flagged in the report</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {criticalPending.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <Circle size={5} color="var(--red)" fill="var(--red)" />
                {criticalPending.length} critical obligation{criticalPending.length > 1 ? 's' : ''} with up to ₹250 crore exposure pending
              </div>
            )}
            {overdueRights.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <Circle size={5} color="var(--red)" fill="var(--red)" />
                {overdueRights.length} rights request{overdueRights.length > 1 ? 's' : ''} past the 7-day deadline
              </div>
            )}
            {unreportedBreaches.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <Circle size={5} color="var(--red)" fill="var(--red)" />
                {unreportedBreaches.length} breach{unreportedBreaches.length > 1 ? 'es' : ''} not yet notified to the Board
              </div>
            )}
          </div>
        </div>
      )}

      {/* What's included */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Report includes</div>
        {[
          { icon: CheckCircle2, label: 'Executive summary with compliance score', active: true },
          { icon: CheckCircle2, label: `Full obligations register (${relevantObligations.length} obligations)`, active: true },
          { icon: CheckCircle2, label: 'Compliance breakdown by category', active: true },
          { icon: CheckCircle2, label: `Rights requests log (${rights.length} entries)`, active: rights.length > 0 },
          { icon: CheckCircle2, label: `Breach incident log (${breaches.length} entries)`, active: breaches.length > 0 },
          { icon: CheckCircle2, label: `SDF classification: ${isSdf ? 'Significant Data Fiduciary' : 'Standard Data Fiduciary'}`, active: true },
        ].map(({ icon: Icon, label, active }, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
            <Icon size={13} color={active ? 'var(--green)' : 'var(--text-muted)'} />
            <span style={{ fontSize: 12, color: active ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          className="btn-primary"
          onClick={() => generatePDF(store, CATEGORY_LABELS)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', fontSize: 14 }}
        >
          <Download size={15} />
          Export compliance report
        </button>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          Exports as an HTML file - open in browser and print to PDF
        </div>
      </div>
    </div>
  )
}
