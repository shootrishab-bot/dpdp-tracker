'use client'

import { useStore } from '@/lib/context'
import { CATEGORY_LABELS } from '@/lib/obligations-data'
import { AlertTriangle, CheckCircle2, Clock, TrendingUp, ArrowRight, Shield, AlertCircle, Timer } from 'lucide-react'
import { RULE_COMMENCEMENT, getCountdown } from '@/lib/commencement'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  return now
}


function PhaseRing({ done, total, label, color, targetDate }: {
  done: number; total: number; label: string; color: string; targetDate: Date | null
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setMounted(true), 60000)
    return () => clearInterval(t)
  }, [])

  const pct = total > 0 ? done / total : 0
  const r = 22
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)

  let miniTimer: string | null = null
  if (targetDate && mounted) {
    const { days, hours, past } = getCountdown(targetDate)
    miniTimer = past ? 'In force' : days > 0 ? `${days}d ${hours}h` : `${hours}h`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color }}>{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>{label}</span>
      {miniTimer && (
        <span style={{
          fontSize: 9, fontWeight: 600, color,
          background: 'rgba(0,0,0,0.3)', border: `1px solid ${color}33`,
          padding: '1px 6px', borderRadius: 20,
        }}>
          {miniTimer}
        </span>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { complianceStats, score, statuses, isSdf, orgName, relevantObligations, rights, breaches } = useStore()

  const criticalPending = relevantObligations.filter(
    o => o.penalty_tier === 'critical' && (!statuses[o.id] || statuses[o.id] === 'pending')
  )
  const openRights = rights.filter(r => r.status !== 'closed' && r.status !== 'responded').slice(0, 4)
  const recentBreaches = breaches.filter(b => b.status !== 'closed').slice(0, 3)
  const overdueRights = rights.filter(r => r.status !== 'closed' && r.status !== 'responded' && !r.date_responded)

  const byCategory = Object.entries(
    relevantObligations.reduce<Record<string, { total: number; done: number }>>((acc, o) => {
      if (!acc[o.category]) acc[o.category] = { total: 0, done: 0 }
      acc[o.category].total++
      if (statuses[o.id] === 'done' || statuses[o.id] === 'not_applicable') acc[o.category].done++
      return acc
    }, {})
  )

  const scoreColor = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'

  const phases = [2, 3, 4].map(phase => {
    const obs = relevantObligations.filter(o => o.phase === phase)
    const done = obs.filter(o => statuses[o.id] === 'done' || statuses[o.id] === 'not_applicable').length
    return { phase, total: obs.length, done }
  })

  return (
    <div style={{ padding: 'clamp(16px, 3vw, 32px)', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 24, alignItems: 'start' }} className='dashboard-grid'>
      {/* LEFT COLUMN */}
      <div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)' }}>{orgName}</h1>
            {isSdf && <span className="badge badge-purple">SDF</span>}
            {(orgName === 'Your Organisation' || orgName === 'My Organisation') && (
              <Link href="/settings" style={{ fontSize: 11, color: 'var(--teal)', background: 'var(--teal-bg)', border: '1px solid var(--teal-border)', padding: '2px 9px', borderRadius: 20, textDecoration: 'none' }}>
                Set firm name →
              </Link>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>DPDP Act 2023 &amp; Rules 2025 - compliance overview</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-label">Compliance score</div>
            <div className="stat-value" style={{ color: scoreColor, fontSize: 32 }}>{score}%</div>
            <div className="progress-bar" style={{ marginTop: 10 }}>
              <div className="progress-fill" style={{ width: `${score}%`, background: scoreColor }} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total</div>
            <div className="stat-value" style={{ color: 'var(--text-primary)' }}>{complianceStats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{complianceStats.done}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">In progress</div>
            <div className="stat-value" style={{ color: 'var(--blue)' }}>{complianceStats.in_progress}</div>
          </div>
        </div>

        {/* Alerts */}
        {overdueRights.length > 0 && (
          <div className="alert-red" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={13} color="var(--red)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fca5a5' }}>
                  {overdueRights.length} rights request{overdueRights.length > 1 ? 's' : ''} past 7-day deadline
                </span>
              </div>
              <Link href="/rights" style={{ fontSize: 12, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: 4 }}>
                View <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        )}

        {criticalPending.length > 0 && (
          <div className="alert-red" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={13} color="var(--red)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fca5a5' }}>
                {criticalPending.length} critical obligation{criticalPending.length > 1 ? 's' : ''} not yet started
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {criticalPending.slice(0, 4).map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 13, color: '#fecaca', fontWeight: 500, marginBottom: 2 }}>{o.title}</p>
                    <p style={{ fontSize: 11, color: '#f87171' }}>{o.section_reference}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fca5a5', whiteSpace: 'nowrap' }}>{o.penalty_amount}</span>
                </div>
              ))}
              {criticalPending.length > 4 && (
                <Link href="/obligations" style={{ fontSize: 12, color: '#f87171' }}>View all {criticalPending.length} →</Link>
              )}
            </div>
          </div>
        )}

        {/* Category breakdown */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <TrendingUp size={13} color="var(--amber)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Compliance by category</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {byCategory.map(([cat, { total, done }]) => {
              const pct = Math.round((done / total) * 100)
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{CATEGORY_LABELS[cat] ?? cat}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{done}/{total}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : pct > 0 ? 'var(--amber)' : 'var(--border)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Phase rings */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>Phase progress</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <PhaseRing done={phases[0].done} total={phases[0].total} label="Phase 2: Consent Manager" color="var(--amber)" targetDate={RULE_COMMENCEMENT.oneYear} />
            <PhaseRing done={phases[1].done} total={phases[1].total} label="Phase 3: All obligations" color="var(--blue)" targetDate={RULE_COMMENCEMENT.eighteenMonths} />
            {isSdf && <PhaseRing done={phases[2].done} total={phases[2].total} label="Phase 4: SDF obligations" color="var(--purple)" targetDate={null} />}
          </div>
        </div>

        {/* Open rights requests */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Rights requests</div>
            <Link href="/rights" style={{ fontSize: 11, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 3 }}>
              All <ArrowRight size={10} />
            </Link>
          </div>
          {openRights.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
              <CheckCircle2 size={13} color="var(--green)" />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No open requests</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {openRights.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.principal_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.type}</p>
                  </div>
                  <span style={{ fontSize: 11, color: r.status === "responded" ? "var(--green)" : "var(--text-muted)" }}>{r.status === "responded" ? "Responded" : `${Math.floor((new Date().getTime() - new Date(r.date_received).getTime()) / 86400000)}d open`}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active breaches */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Active breaches</div>
            <Link href="/breaches" style={{ fontSize: 11, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 3 }}>
              All <ArrowRight size={10} />
            </Link>
          </div>
          {recentBreaches.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0' }}>
              <CheckCircle2 size={13} color="var(--green)" />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No active breaches</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentBreaches.map(b => (
                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.date_discovered}</p>
                  </div>
                  <span style={{ fontSize: 10, color: b.date_notified_board_detailed ? 'var(--green)' : 'var(--red)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {b.date_notified_board_detailed ? 'Notified' : '72h pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Commencement countdown */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Next commencement</div>
            <a href="/commencement" style={{ fontSize: 11, color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
              All <ArrowRight size={10} />
            </a>
          </div>
          {(() => {
            const now = new Date()
            const targets = [
              { date: RULE_COMMENCEMENT.oneYear, label: 'Rule 4', sub: 'Consent Manager registration', color: 'var(--teal)' },
              { date: RULE_COMMENCEMENT.eighteenMonths, label: 'Rules 3, 5-16, 22-23', sub: 'Substantive obligations', color: 'var(--blue)' },
            ]
            const next = targets.find(t => t.date > now)
            if (!next) return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={13} color="var(--green)" />
                <span style={{ fontSize: 12, color: 'var(--green)' }}>All timed rules in force</span>
              </div>
            )
            const { days, hours } = getCountdown(next.date)
            return (
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <div style={{ textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: next.color, fontVariantNumeric: 'tabular-nums' }}>{days}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>days</div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: next.color, fontVariantNumeric: 'tabular-nums' }}>{hours}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>hrs</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, color: next.color, marginBottom: 2 }}>{next.label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{next.sub}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                  {next.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            )
          })()}
        </div>

        {/* Quick actions */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Quick actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { href: '/obligations', label: 'Update obligation status', icon: CheckCircle2 },
              { href: '/rights', label: 'Log a rights request', icon: Clock },
              { href: '/sdf', label: 'Run SDF assessment', icon: Shield },
              { href: '/audit', label: 'Export compliance report', icon: AlertCircle },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                borderRadius: 8, background: 'var(--bg-elevated)', textDecoration: 'none',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
              >
                <Icon size={12} color="var(--amber)" />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                <ArrowRight size={10} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
