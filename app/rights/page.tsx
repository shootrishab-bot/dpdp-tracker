'use client'

import { useState } from 'react'
import { useStore } from '@/lib/context'
import type { RightsRequest, RightsRequestType, RightsRequestStatus } from '@/lib/store'
import { Plus, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

const TYPE_LABELS: Record<RightsRequestType, string> = {
  access: 'Access - S.11',
  correction: 'Correction - S.12',
  erasure: 'Erasure - S.12',
  nomination: 'Nomination - S.14',
  grievance: 'Grievance - S.13',
}

const STATUS_LABELS: Record<RightsRequestStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  responded: 'Responded',
  closed: 'Closed',
}

const STATUS_COLORS: Record<RightsRequestStatus, { bg: string; color: string }> = {
  open: { bg: 'var(--red-bg)', color: '#fca5a5' },
  in_progress: { bg: 'var(--blue-bg)', color: '#93c5fd' },
  responded: { bg: 'var(--green-bg)', color: '#6ee7b7' },
  closed: { bg: 'var(--bg-elevated)', color: 'var(--text-muted)' },
}

const EMPTY_FORM = {
  type: 'access' as RightsRequestType,
  principal_name: '',
  principal_email: '',
  description: '',
  date_received: new Date().toISOString().split('T')[0],
  date_responded: null as string | null,
  status: 'open' as RightsRequestStatus,
  notes: '',
}

function daysSince(dateStr: string): number {
  return Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 86400000)
}

export default function RightsPage() {
  const { rights, addRightsRequest, updateRightsRequest, deleteRightsRequest } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  function handleSubmit() {
    if (!form.principal_name || !form.date_received) return
    addRightsRequest(form)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const filtered = rights.filter(r => filterStatus === 'all' || r.status === filterStatus)
  const openCount = rights.filter(r => r.status === 'open' || r.status === 'in_progress').length

  const inputStyle = { width: '100%', padding: '8px 10px', fontSize: 13 }
  const labelStyle: React.CSSProperties = { fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Data Principal rights requests</h1>
          <p className="page-sub">Log and track requests under Sections 11-14 of the DPDP Act 2023</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={14} /> Log request
        </button>
      </div>

      <div className="alert-amber" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertCircle size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--amber-bright)', lineHeight: 1.7 }}>
            <strong>Response timelines:</strong> Rule 14(3) sets a maximum of 90 days for responding to <em>grievances</em> under Section 13. For the other rights -- access (Section 11), correction and erasure (Section 12), and nomination (Section 14) -- no specific deadline has been prescribed yet. These timelines will be set by the Data Protection Board once constituted. Track date received and date responded to demonstrate diligence in the interim.
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Log new request</span>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={15} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Request type *</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as RightsRequestType }))} style={inputStyle}>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Date received *</label>
              <input type="date" value={form.date_received} onChange={e => setForm(p => ({ ...p, date_received: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Data Principal name *</label>
              <input type="text" placeholder="Full name" value={form.principal_name} onChange={e => setForm(p => ({ ...p, principal_name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email or contact</label>
              <input type="text" placeholder="email@example.com" value={form.principal_email} onChange={e => setForm(p => ({ ...p, principal_email: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Description of request</label>
              <textarea placeholder="What is the Data Principal requesting?" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'none' as const }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Internal notes</label>
              <input type="text" placeholder="Handler, status, action taken..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit}>Save request</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'open', 'in_progress', 'responded', 'closed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: '1px solid',
              background: filterStatus === s ? 'var(--amber-bg)' : 'var(--bg-elevated)',
              color: filterStatus === s ? 'var(--amber-bright)' : 'var(--text-muted)',
              borderColor: filterStatus === s ? 'var(--amber-border)' : 'var(--border)',
            }}
          >
            {s === 'all' ? `All (${rights.length})` : `${STATUS_LABELS[s]} (${rights.filter(r => r.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <CheckCircle2 size={32} color="var(--green)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {rights.length === 0 ? 'No requests logged yet.' : 'No requests match this filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(req => {
            const days = daysSince(req.date_received)
            const isOpen = req.status === 'open' || req.status === 'in_progress'
            const sc = STATUS_COLORS[req.status]
            return (
              <div key={req.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{req.principal_name}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: 'var(--amber-bg)', color: 'var(--amber-bright)', border: '1px solid var(--amber-border)' }}>
                        {TYPE_LABELS[req.type]}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: sc.bg, color: sc.color, border: `1px solid ${sc.bg}` }}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    </div>
                    {req.principal_email && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{req.principal_email}</p>}
                    {req.description && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.6 }}>{req.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <select
                      value={req.status}
                      onChange={e => {
                        const newStatus = e.target.value as RightsRequestStatus
                        updateRightsRequest(req.id, {
                          status: newStatus,
                          date_responded: (newStatus === 'responded' || newStatus === 'closed') && !req.date_responded
                            ? new Date().toISOString().split('T')[0] : req.date_responded,
                        })
                      }}
                      style={{ padding: '5px 8px', fontSize: 12, width: 'auto' }}
                    >
                      {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button onClick={() => deleteRightsRequest(req.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Received</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{req.date_received}</p>
                  </div>
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Days open</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: isOpen && days > 30 ? '#f97316' : isOpen && days > 60 ? 'var(--red)' : 'var(--text-secondary)' }}>
                      {isOpen ? `${days} day${days !== 1 ? 's' : ''}` : '-'}
                    </p>
                  </div>
                  <div style={{ background: req.date_responded ? 'var(--green-bg)' : 'var(--bg-elevated)', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Responded</p>
                    <p style={{ fontSize: 12, color: req.date_responded ? '#6ee7b7' : 'var(--text-muted)', fontWeight: 500 }}>
                      {req.date_responded ?? 'Pending'}
                    </p>
                  </div>
                </div>

                {req.notes && (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    {req.notes}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
