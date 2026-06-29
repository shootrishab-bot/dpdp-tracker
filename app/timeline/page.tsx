'use client'

import { useStore } from '@/lib/context'
import { CATEGORY_LABELS } from '@/lib/obligations-data'
import type { ObligationStatus } from '@/lib/supabase'
import { CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react'

const PHASE_INFO = [
  {
    phase: 2,
    label: 'Phase 2 - Consent Manager registration',
    sublabel: 'Applies from 13 November 2026',
    note: 'Section 6(9) and Rule 4 only. Consent Manager registration with the Board. Relevant only to organisations seeking to operate as a Consent Manager.',
    accent: 'var(--amber)',
    bg: 'var(--amber-bg)',
    border: 'var(--amber-border)',
  },
  {
    phase: 3,
    label: 'Phase 3 - All substantive obligations',
    sublabel: 'Applies from 13 May 2027',
    note: 'All substantive Data Fiduciary obligations under Sections 3-17 of the Act and Rules 3, 5-16, 22-23 come into force on 13 May 2027 per the MeitY Enforcement Notification and Rule 1(4).',
    accent: 'var(--blue)',
    bg: 'var(--blue-bg)',
    border: '#0a1a2a',
  },
  {
    phase: 4,
    label: 'Phase 4 - SDF-specific obligations',
    sublabel: 'Applies on SDF designation notification',
    note: 'SDF-specific obligations under Section 10(2) and Rule 13 apply only after the Central Government issues a gazette notification designating the organisation as a Significant Data Fiduciary under Section 10(1). No SDF designations have been issued as of June 2026.',
    accent: 'var(--purple)',
    bg: 'var(--purple-bg)',
    border: 'var(--purple-border)',
  },
]

const StatusIcon = ({ status }: { status: ObligationStatus }) => {
  if (status === 'done') return <CheckCircle2 size={13} color="var(--green)" />
  if (status === 'in_progress') return <Clock size={13} color="var(--blue)" />
  return <Circle size={13} color="var(--border-bright)" />
}

export default function TimelinePage() {
  const { statuses, relevantObligations } = useStore()

  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <h1 className="page-title">Compliance timeline</h1>
      <p className="page-sub">Obligations grouped by when they apply</p>

      <div className="alert-amber" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertCircle size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--amber-bright)', lineHeight: 1.7 }}>
            <strong>Commencement status (as of June 2026):</strong> On 13 November 2025, MeitY issued the DPDP Rules 2025 and a separate Enforcement Notification bringing specific Act provisions into force on a phased basis. Phase 1 (Board constitution, definitions) is already in force. Phase 2 (Consent Manager registration) commences 13 November 2026. Phase 3 - all substantive Data Fiduciary obligations - commences 13 May 2027. See the <a href="/commencement" style={{ color: 'var(--amber)', textDecoration: 'underline' }}>Commencement timers</a> page for live countdowns.
          </div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 20, top: 32, bottom: 32, width: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PHASE_INFO.map(({ phase, label, sublabel, note, accent, bg, border }) => {
            const phaseObs = relevantObligations.filter(o => o.phase === phase)
            const done = phaseObs.filter(o => statuses[o.id] === 'done' || statuses[o.id] === 'not_applicable').length
            const pct = phaseObs.length ? Math.round((done / phaseObs.length) * 100) : 0

            return (
              <div key={phase} style={{ position: 'relative', paddingLeft: 52 }}>
                <div style={{
                  position: 'absolute', left: 12, top: 18, width: 16, height: 16,
                  borderRadius: '50%', background: accent,
                  border: '2px solid var(--bg-base)', boxShadow: `0 0 0 3px ${bg}`,
                }} />
                <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <h2 style={{ fontSize: 15, fontWeight: 600, color: accent }}>{label}</h2>
                        <span style={{ fontSize: 11, color: accent, background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 20 }}>
                          {done}/{phaseObs.length} done
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4 }}>{sublabel}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>{note}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>{pct}%</div>
                      <div className="progress-bar" style={{ width: 80, marginTop: 4 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: accent }} />
                      </div>
                    </div>
                  </div>

                  {phaseObs.length === 0 ? (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No obligations in this phase for your current configuration.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {phaseObs.map(o => {
                        const status = (statuses[o.id] ?? 'pending') as ObligationStatus
                        return (
                          <div key={o.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '10px 12px' }}>
                            <div style={{ marginTop: 2 }}><StatusIcon status={status} /></div>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 2 }}>{o.title}</p>
                              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.section_reference} · {CATEGORY_LABELS[o.category]}</p>
                            </div>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                              {status === 'not_applicable' ? 'N/A' : status === 'in_progress' ? 'In progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
