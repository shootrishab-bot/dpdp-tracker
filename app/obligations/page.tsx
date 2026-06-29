'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/context'
import { CATEGORY_LABELS } from '@/lib/obligations-data'
import type { ObligationStatus } from '@/lib/supabase'
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'badge-pending', in_progress: 'badge-in-progress', done: 'badge-done', not_applicable: 'badge-na',
}
const PENALTY_BADGE: Record<string, string> = {
  critical: 'badge-critical', high: 'badge-high', medium: 'badge-medium', low: 'badge-low',
}

export default function ObligationsPage() {
  const { relevantObligations, statuses, notes, assignees, setStatus, setNote, setAssignee } = useStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('highlight')
  const [blinking, setBlinking] = useState<string | null>(null)
  const highlightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (highlightId) {
      setExpanded(highlightId)
      setBlinking(highlightId)
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
      setTimeout(() => setBlinking(null), 2500)
    }
  }, [highlightId])

  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPhase, setFilterPhase] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPenalty, setFilterPenalty] = useState('all')
  const [search, setSearch] = useState('')

  const categories = Array.from(new Set(relevantObligations.map(o => o.category)))

  const filtered = relevantObligations.filter(o => {
    if (filterStatus !== 'all' && (statuses[o.id] ?? 'pending') !== filterStatus) return false
    if (filterPhase !== 'all' && String(o.phase) !== filterPhase) return false
    if (filterCategory !== 'all' && o.category !== filterCategory) return false
    if (filterPenalty !== 'all' && o.penalty_tier !== filterPenalty) return false
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.section_reference.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const selStyle = {
    padding: '6px 12px', fontSize: 12, background: 'var(--bg-elevated)',
    border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer',
  }

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Obligations</h1>
        <p className="page-sub">All compliance obligations under the DPDP Act 2023 and Rules 2025</p>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <Filter size={13} color="var(--text-muted)" />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={12} color="var(--text-muted)" style={{ position: 'absolute', left: 10 }} />
          <input
            type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 6, paddingBottom: 6, fontSize: 12, width: 180 }}
          />
        </div>
        {[
          { value: filterStatus, onChange: setFilterStatus, options: [['all','All statuses'],['pending','Pending'],['in_progress','In progress'],['done','Done'],['not_applicable','N/A']] },
          { value: filterPhase, onChange: setFilterPhase, options: [['all','All phases'],['2','Phase 2 - 13 Nov 2026'],['3','Phase 3 - 13 May 2027'],['4','Phase 4 - SDF notification']] },
          { value: filterCategory, onChange: setFilterCategory, options: [['all','All categories'], ...categories.map(c => [c, CATEGORY_LABELS[c] ?? c])] },
          { value: filterPenalty, onChange: setFilterPenalty, options: [['all','All tiers'],['critical','Critical'],['high','High'],['medium','Medium'],['low','Low']] },
        ].map((sel, i) => (
          <select key={i} value={sel.value} onChange={e => sel.onChange(e.target.value)} style={selStyle as React.CSSProperties}>
            {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>{filtered.length} obligations</span>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No obligations match your filters.</div>
        ) : (
          filtered.map(o => {
            const status = (statuses[o.id] ?? 'pending') as ObligationStatus
            const isOpen = expanded === o.id
            return (
              <div key={o.id} className="table-row">
                <div
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', cursor: 'pointer' }}
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                >
                  <div onClick={e => e.stopPropagation()}>
                    <select
                      value={status}
                      onChange={e => setStatus(o.id, e.target.value as ObligationStatus)}
                      className={`badge ${STATUS_COLORS[status]}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In progress</option>
                      <option value="done">Done</option>
                      <option value="not_applicable">N/A</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{o.title}</p>
                      {o.applies_to_sdf_only && <span className="badge badge-purple" style={{ fontSize: 10 }}>SDF only</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.section_reference}</span>
                      <span className={`badge ${PENALTY_BADGE[o.penalty_tier]}`}>{o.penalty_tier.charAt(0).toUpperCase() + o.penalty_tier.slice(1)} · {o.penalty_amount}</span>
                      <span className="badge badge-na">{o.phase === 2 ? "Phase 2 · 13 Nov 2026" : o.phase === 3 ? "Phase 3 · 13 May 2027" : "Phase 4 · SDF notification"}</span>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', paddingTop: 2 }}>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: '0 16px 16px 16px', marginLeft: 80 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{o.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Assignee</label>
                        <input type="text" placeholder="Name or email" value={assignees[o.id] ?? ''} onChange={e => setAssignee(o.id, e.target.value)} style={{ width: '100%', padding: '7px 10px', fontSize: 12 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Notes</label>
                        <input type="text" placeholder="Implementation notes..." value={notes[o.id] ?? ''} onChange={e => setNote(o.id, e.target.value)} style={{ width: '100%', padding: '7px 10px', fontSize: 12 }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
