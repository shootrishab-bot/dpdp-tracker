'use client'

import { useState } from 'react'
import { useStore } from '@/lib/context'
import type { BreachEntry } from '@/lib/store'
import { AlertTriangle, Plus, CheckCircle2, X, AlertCircle } from 'lucide-react'

const STATUS_LABELS: Record<BreachEntry['status'], string> = {
  discovered: 'Discovered',
  preliminary_sent: 'Preliminary sent to Board',
  detailed_sent: 'Detailed report sent to Board',
  principals_notified: 'Data Principals notified',
  closed: 'Closed',
}

const STATUS_BADGE: Record<BreachEntry['status'], string> = {
  discovered: 'badge-critical',
  preliminary_sent: 'badge-medium',
  detailed_sent: 'badge-in-progress',
  principals_notified: 'badge-amber',
  closed: 'badge-done',
}

const EMPTY: Omit<BreachEntry, 'id' | 'created_at'> = {
  title: '',
  description: '',
  date_discovered: '',
  date_notified_board_preliminary: null,
  date_notified_board_detailed: null,
  date_notified_principals: null,
  principals_affected: 0,
  status: 'discovered',
}

function hoursElapsed(from: string, to: string | null): number | null {
  if (!to) return null
  return (new Date(to).getTime() - new Date(from).getTime()) / 3600000
}

export default function BreachesPage() {
  const { breaches, addBreach, updateBreach, deleteBreach } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)

  const inputStyle = { width: '100%', padding: '8px 10px', fontSize: 13 }
  const labelStyle: React.CSSProperties = { fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }

  const unresolvedBreaches = breaches.filter(b => b.status !== 'closed')

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Breach log</h1>
          <p className="page-sub">Record personal data breaches and track notification obligations under Section 8(6) and Rule 7</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Log breach
        </button>
      </div>

      <div className="alert-amber" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertCircle size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--amber-bright)', lineHeight: 1.7 }}>
            <strong>Two-stage Board notification (Rule 7(2)):</strong> On becoming aware of a breach, notify the Board of the nature, extent, timing, location and likely impact <strong>without delay</strong> (preliminary). Then, within <strong>72 hours</strong> of becoming aware, send the detailed report including causes, mitigation measures, findings on the person responsible, remedial measures, and a report on Data Principal notifications. The 72-hour clock runs from the time of awareness, not from discovery.
            <br /><br />
            <strong>Data Principal notification (Rule 7(1)):</strong> Notify each affected Data Principal <strong>without delay</strong> through their user account or registered communication channel. There is no separate hour-based deadline for Data Principal notification.
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>New breach entry</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={15} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Incident title *</label>
              <input type="text" placeholder="e.g. Unauthorised access to customer records" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Description (nature, extent, categories of data affected)</label>
              <textarea rows={2} placeholder="Describe the nature and extent of the breach and the personal data categories affected..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'none' as const }} />
            </div>
            <div>
              <label style={labelStyle}>Date / time became aware *</label>
              <input type="date" value={form.date_discovered} onChange={e => setForm(p => ({ ...p, date_discovered: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data Principals affected (approx.)</label>
              <input type="number" min={0} value={form.principals_affected} onChange={e => setForm(p => ({ ...p, principals_affected: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date preliminary notice sent to Board</label>
              <input type="date" value={form.date_notified_board_preliminary ?? ''} onChange={e => setForm(p => ({ ...p, date_notified_board_preliminary: e.target.value || null }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date detailed report sent to Board (72h)</label>
              <input type="date" value={form.date_notified_board_detailed ?? ''} onChange={e => setForm(p => ({ ...p, date_notified_board_detailed: e.target.value || null }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Date Data Principals notified</label>
              <input type="date" value={form.date_notified_principals ?? ''} onChange={e => setForm(p => ({ ...p, date_notified_principals: e.target.value || null }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as BreachEntry['status'] }))} style={inputStyle}>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={() => {
              if (!form.title || !form.date_discovered) return
              addBreach(form)
              setForm(EMPTY)
              setShowForm(false)
            }}>Save entry</button>
          </div>
        </div>
      )}

      {breaches.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <CheckCircle2 size={32} color="var(--green)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No breaches logged. Use the button above if an incident occurs.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {breaches.map(b => {
            const detailedHours = hoursElapsed(b.date_discovered, b.date_notified_board_detailed)
            const detailed72hExceeded = detailedHours !== null && detailedHours > 72
            const detailedPending = !b.date_notified_board_detailed

            return (
              <div key={b.id} className="card" style={{ padding: 18, borderColor: (detailedPending && b.status !== 'closed') ? 'var(--red-border)' : 'var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{b.title}</span>
                      <span className={`badge ${STATUS_BADGE[b.status]}`}>{STATUS_LABELS[b.status]}</span>
                      {detailed72hExceeded && <span className="badge badge-critical">72h exceeded</span>}
                    </div>
                    {b.description && <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.description}</p>}
                    {b.principals_affected > 0 && (
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{b.principals_affected.toLocaleString('en-IN')} Data Principals affected</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <select value={b.status} onChange={e => updateBreach(b.id, { status: e.target.value as BreachEntry['status'] })} style={{ padding: '5px 8px', fontSize: 12, width: 'auto' }}>
                      {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button onClick={() => deleteBreach(b.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {[
                    {
                      label: 'BECAME AWARE',
                      value: b.date_discovered || 'Not set',
                      color: 'var(--text-secondary)',
                      bg: 'var(--bg-elevated)',
                    },
                    {
                      label: 'PRELIMINARY TO BOARD',
                      value: b.date_notified_board_preliminary ?? 'Pending - send without delay',
                      color: b.date_notified_board_preliminary ? '#6ee7b7' : '#fca5a5',
                      bg: b.date_notified_board_preliminary ? 'var(--green-bg)' : 'var(--red-bg)',
                    },
                    {
                      label: 'DETAILED TO BOARD (72H)',
                      value: b.date_notified_board_detailed
                        ? `${b.date_notified_board_detailed}${detailedHours !== null ? ` (${Math.round(detailedHours)}h)` : ''}`
                        : 'Pending - within 72 hours',
                      color: b.date_notified_board_detailed
                        ? (detailed72hExceeded ? '#fdba74' : '#6ee7b7')
                        : '#fca5a5',
                      bg: b.date_notified_board_detailed
                        ? (detailed72hExceeded ? '#1a0d00' : 'var(--green-bg)')
                        : 'var(--red-bg)',
                    },
                    {
                      label: 'DATA PRINCIPALS NOTIFIED',
                      value: b.date_notified_principals ?? 'Pending - without delay',
                      color: b.date_notified_principals ? '#6ee7b7' : '#fca5a5',
                      bg: b.date_notified_principals ? 'var(--green-bg)' : 'var(--red-bg)',
                    },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ background: bg, borderRadius: 8, padding: '10px 12px' }}>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                      <p style={{ fontSize: 11, color, fontWeight: 500, lineHeight: 1.4 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
