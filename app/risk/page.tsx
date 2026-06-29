'use client'

import { useStore } from '@/lib/context'
import { CATEGORY_LABELS } from '@/lib/obligations-data'
import { ShieldAlert, ShieldCheck, TrendingDown } from 'lucide-react'

const TIERS = [
  { tier: 'critical', label: 'Critical risk', cap: 'Up to ₹250 crore per instance', accent: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)', text: '#fca5a5' },
  { tier: 'high', label: 'High risk', cap: 'Up to ₹200 crore per instance', accent: '#f97316', bg: '#1a0d00', border: '#2a1500', text: '#fdba74' },
  { tier: 'medium', label: 'Medium risk', cap: 'Up to ₹50 crore per instance', accent: 'var(--amber)', bg: 'var(--amber-bg)', border: 'var(--amber-border)', text: 'var(--amber-bright)' },
  { tier: 'low', label: 'Low risk', cap: 'Up to ₹10 crore per instance', accent: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)', text: '#6ee7b7' },
]

export default function RiskPage() {
  const { relevantObligations, statuses } = useStore()

  const pendingByTier = TIERS.map(t => ({
    ...t,
    obligations: relevantObligations.filter(o => o.penalty_tier === t.tier && (!statuses[o.id] || statuses[o.id] === 'pending')),
  }))

  const mitigated = relevantObligations.filter(o => statuses[o.id] === 'done' || statuses[o.id] === 'not_applicable').length

  return (
    <div className="page">
      <h1 className="page-title">Risk and penalties</h1>
      <p className="page-sub">Outstanding obligations ranked by penalty exposure under Schedule 1</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Critical gaps</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{pendingByTier[0].obligations.length}</div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>up to ₹250 crore per instance</p>
        </div>
        <div className="stat-card">
          <div className="stat-label">High-risk gaps</div>
          <div className="stat-value" style={{ color: '#f97316' }}>{pendingByTier[1].obligations.length}</div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>up to ₹200 crore per instance</p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mitigated</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{mitigated}</div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>of {relevantObligations.length} total</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pendingByTier.map(({ tier, label, cap, accent, bg, border, text, obligations }) => (
          <div key={tier} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {obligations.length === 0
                  ? <ShieldCheck size={15} color="var(--green)" />
                  : <ShieldAlert size={15} color={accent} />
                }
                <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{label}</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cap}</span>
            </div>

            {obligations.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px' }}>
                <ShieldCheck size={13} color="var(--green)" />
                <span style={{ fontSize: 13, color: '#6ee7b7', fontWeight: 500 }}>All {tier} obligations addressed</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {obligations.map(o => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{o.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.section_reference} · {CATEGORY_LABELS[o.category]} · {o.phase === 2 ? 'Phase 2' : o.phase === 3 ? 'Phase 3' : 'Phase 4 (SDF)'}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: text, whiteSpace: 'nowrap' }}>{o.penalty_amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 16, marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <TrendingDown size={13} color="var(--text-muted)" style={{ marginTop: 1, flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Figures are statutory maxima per instance under the Second Schedule of the DPDP Act 2023. The Data Protection Board retains discretion in determining final penalties after adjudication.
        </p>
      </div>
    </div>
  )
}
