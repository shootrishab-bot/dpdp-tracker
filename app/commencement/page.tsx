'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  RULE_COMMENCEMENT, RULE_GROUP_LABELS, RULE_GROUP_RULE,
  RULE_GROUP_COLORS, OBLIGATION_RULE_GROUP, getCountdown, type RuleGroup,
} from '@/lib/commencement'
import { CATEGORY_LABELS, PHASE_LABELS } from '@/lib/obligations-data'
import { useStore } from '@/lib/context'
import { CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react'

// ── Flip digit ───────────────────────────────────────────────────────────────
function FlipDigit({ value }: { value: string }) {
  const [display, setDisplay] = useState(value)
  const [flipping, setFlipping] = useState(false)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current !== value) {
      setFlipping(true)
      const t = setTimeout(() => {
        setDisplay(value)
        setFlipping(false)
        prev.current = value
      }, 150)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <div style={{
      width: 46, height: 58,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-bright)',
      borderRadius: 7,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,0,0,0.5)', zIndex: 2 }} />
      <span style={{
        fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
        color: 'var(--amber-bright)',
        transform: flipping ? 'scaleY(0.4)' : 'scaleY(1)',
        transition: 'transform 0.15s ease-in',
        display: 'block', lineHeight: 1,
      }}>
        {display}
      </span>
    </div>
  )
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  // Render 3 digit cards when days >= 100, otherwise 2
  const digits = value >= 100
    ? String(value).split('')
    : String(value).padStart(2, '0').split('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {digits.map((d, i) => <FlipDigit key={i} value={d} />)}
      </div>
      <span style={{ fontSize: 9, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
    </div>
  )
}

function Colon({ color }: { color: string }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: visible ? color : 'var(--border)', transition: 'background 0.2s' }} />
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: visible ? color : 'var(--border)', transition: 'background 0.2s' }} />
    </div>
  )
}

function FlipTimer({ date, color }: { date: Date; color: string }) {
  // Initialise to null to avoid SSR/client mismatch -- only render live values after mount
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Before mount, render a stable placeholder so SSR and client first render match
  if (!now) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, opacity: 0 }}>
        <FlipUnit value={0} label="days" />
        <Colon color={color} />
        <FlipUnit value={0} label="hrs" />
        <Colon color={color} />
        <FlipUnit value={0} label="min" />
        <Colon color={color} />
        <FlipUnit value={0} label="sec" />
      </div>
    )
  }

  const { days, hours, minutes, past } = getCountdown(date)
  const seconds = past ? 0 : Math.abs(Math.floor((date.getTime() - now.getTime()) / 1000) % 60)

  if (past) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircle2 size={16} color="var(--green)" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>In force</div>
          <div style={{ fontSize: 11, color: '#6ee7b7' }}>
            Since {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5 }}>
      <FlipUnit value={days} label="days" />
      <Colon color={color} />
      <FlipUnit value={hours} label="hrs" />
      <Colon color={color} />
      <FlipUnit value={minutes} label="min" />
      <Colon color={color} />
      <FlipUnit value={seconds} label="sec" />
    </div>
  )
}

// ── Phase summary card (horizontal layout) ────────────────────────────────────
function PhaseCard({
  phaseNum, date, accent, bg, border, title, subtitle, body,
}: {
  phaseNum: number; date: Date; accent: string; bg: string; border: string
  title: string; subtitle: string; body: string
}) {
  const { past } = getCountdown(date)
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '20px 24px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Phase {phaseNum}
          </span>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{title}</div>
          <div style={{ fontSize: 11, color: accent, marginTop: 2 }}>{subtitle}</div>
        </div>
        {past && (
          <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(16,185,129,0.15)', color: 'var(--green)', border: '1px solid var(--green-border)', padding: '3px 10px', borderRadius: 20 }}>
            ✓ In force
          </span>
        )}
      </div>
      {/* Timer + description side by side */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28, flexWrap: 'wrap' }}>
        <div style={{ flexShrink: 0, minWidth: 320 }}>
          <FlipTimer date={date} color={accent} />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
            {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, paddingTop: 4 }}>
          {body}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const GROUPS: RuleGroup[] = ['immediate', 'oneYear', 'eighteenMonths', 'sdfNotification']

export default function CommencementPage() {
  const { statuses, relevantObligations } = useStore()
  const [expanded, setExpanded] = useState<RuleGroup | null>('eighteenMonths')
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const router = useRouter()

  function handleObligationClick(obligationId: string) {
    // Navigate to obligations page with the obligation ID as a hash
    router.push(`/obligations?highlight=${obligationId}`)
  }

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <h1 className="page-title">Commencement timers</h1>
      <p className="page-sub">
        Phased enforcement dates · Gazette date: 13 November 2025 · G.S.R. 846(E)
      </p>

      <div className="alert-amber" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertCircle size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--amber-bright)', lineHeight: 1.7 }}>
            On 13 November 2025, MeitY published two gazette notifications: the DPDP Rules 2025 (G.S.R. 846(E)) and a separate Enforcement Notification (G.S.R. 843(E)) bringing specific DPDP Act 2023 provisions into force under Section 1(2). Phase 1 (Board constitution) is already in force. Phase 2 (Consent Manager registration) commences 13 November 2026. Phase 3 - all substantive Data Fiduciary obligations - commences 13 May 2027.
          </div>
        </div>
      </div>

      {/* Three phase cards stacked vertically with horizontal layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        <PhaseCard
          phaseNum={1}
          date={RULE_COMMENCEMENT.immediate}
          accent="var(--green)"
          bg="var(--green-bg)"
          border="var(--green-border)"
          title="Board constitution"
          subtitle="Act ss. 2, 18-26, 38, 44 · Rules 1, 2, 17-21"
          body="Definitions, Board establishment and appointment procedures, salary and service terms, meetings procedure, TRAI Act and RTI Act amendments. Board constituted with four members in NCR. No substantive Data Fiduciary obligations apply yet."
        />
        <PhaseCard
          phaseNum={2}
          date={RULE_COMMENCEMENT.oneYear}
          accent="var(--amber)"
          bg="var(--amber-bg)"
          border="var(--amber-border)"
          title="Consent Manager registration"
          subtitle="Act s. 6(9) · Rule 4 · First Schedule"
          body="Registration conditions and ongoing obligations for Consent Managers. Minimum net worth ₹2 crore, Board registration, interoperability certification. Also Act s. 27(1)(d) - Board inquiry powers for Consent Manager registration breaches. Relevant only to organisations seeking to operate as a Consent Manager."
        />
        <PhaseCard
          phaseNum={3}
          date={RULE_COMMENCEMENT.eighteenMonths}
          accent="var(--blue)"
          bg="var(--blue-bg)"
          border="var(--blue-border)"
          title="All substantive obligations"
          subtitle="Act ss. 3-17 · Rules 3, 5-16, 22-23"
          body="Notice, consent, legitimate uses, security safeguards, breach notification, children's data verification, Data Principal rights, cross-border transfer, SDF DPIA and audit, exemptions. This is the deadline that matters for most organisations."
        />
      </div>

      {/* Obligations by group */}
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
        Obligations by commencement date
      </h2>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
        Click any obligation to jump to it on the Obligations page.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GROUPS.map(group => {
          const colors = RULE_GROUP_COLORS[group]
          const groupObs = relevantObligations.filter(o => OBLIGATION_RULE_GROUP[o.id] === group)
          if (groupObs.length === 0) return null

          const isExpanded = expanded === group
          const date = group !== 'sdfNotification' ? RULE_COMMENCEMENT[group as 'immediate' | 'oneYear' | 'eighteenMonths'] : null
          const countdown = date ? getCountdown(date) : null
          const done = groupObs.filter(o => statuses[o.id] === 'done' || statuses[o.id] === 'not_applicable').length
          const pending = groupObs.filter(o => !statuses[o.id] || statuses[o.id] === 'pending').length

          return (
            <div key={group} style={{ border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div
                onClick={() => setExpanded(isExpanded ? null : group)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', background: colors.bg, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.accent, flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: colors.accent }}>{RULE_GROUP_LABELS[group]}</span>
                      {countdown && !countdown.past && (
                        <span style={{ fontSize: 11, color: colors.accent, background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: 20 }}>
                          {countdown.days}d {countdown.hours}h remaining
                        </span>
                      )}
                      {countdown && countdown.past && (
                        <span style={{ fontSize: 11, color: 'var(--green)', background: 'var(--green-bg)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--green-border)' }}>
                          ✓ In force
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{RULE_GROUP_RULE[group]}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--green)' }}>{done}</span> done · <span style={{ color: pending > 0 ? '#fca5a5' : 'var(--text-muted)' }}>{pending}</span> pending
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{groupObs.length} obligation{groupObs.length !== 1 ? 's' : ''}</div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>{isExpanded ? '↑' : '↓'}</span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ background: 'var(--bg-surface)' }}>
                  {groupObs.map((o, i) => {
                    const status = statuses[o.id] ?? 'pending'
                    const statusColor = status === 'done' ? 'var(--green)' : status === 'in_progress' ? 'var(--blue)' : status === 'not_applicable' ? 'var(--text-muted)' : '#fca5a5'
                    const statusLabel = { done: 'Done', in_progress: 'In progress', pending: 'Pending', not_applicable: 'N/A' }[status]
                    return (
                      <div
                        key={o.id}
                        onClick={() => handleObligationClick(o.id)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 18px',
                          borderTop: i === 0 ? `1px solid ${colors.border}` : '1px solid var(--border)',
                          cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, flexShrink: 0, marginTop: 5 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{o.title}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.section_reference} · {CATEGORY_LABELS[o.category]}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: statusColor }}>{statusLabel}</span>
                          <ExternalLink size={11} color="var(--text-muted)" />
                          {countdown && !countdown.past && status === 'pending' && (
                            <span style={{ fontSize: 10, color: countdown.days < 90 ? '#fca5a5' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Clock size={10} />{countdown.days}d
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="card" style={{ padding: 16, marginTop: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Sources:</strong> G.S.R. 846(E), Digital Personal Data Protection Rules 2025, MeitY, 13 November 2025 · MeitY Enforcement Notification (GSR 843(E), 13 November 2025) bringing DPDP Act 2023 provisions into force under Section 1(2).
        </p>
      </div>
    </div>
  )
}
