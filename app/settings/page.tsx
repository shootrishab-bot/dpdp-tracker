'use client'

import { useState } from 'react'
import { useStore } from '@/lib/context'
import { Building2, ShieldCheck, Info, Pencil, Check, X } from 'lucide-react'

export default function SettingsPage() {
  const { clients, activeClientId, activeClient, isSdf, setOrgName, setIsSdf, updateClient } = useStore()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(activeClient.name)
  const [industryInput, setIndustryInput] = useState(activeClient.industry ?? '')
  const [saved, setSaved] = useState(false)

  function handleSaveName() {
    setOrgName(nameInput)
    updateClient(activeClientId, { industry: industryInput })
    setEditingName(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = { width: '100%', padding: '9px 12px', fontSize: 13, marginBottom: 10 }

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Configure the active client and tracker preferences</p>

      {/* Active client */}
      <div className="card" style={{ padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Building2 size={14} color="var(--amber)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            Active client - {activeClient.name}
          </span>
          {!editingName && (
            <button onClick={() => { setNameInput(activeClient.name); setIndustryInput(activeClient.industry ?? ''); setEditingName(true) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: 4 }}>
              <Pencil size={12} />
            </button>
          )}
        </div>

        {editingName ? (
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Client / organisation name</label>
            <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && handleSaveName()} />
            <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Industry (optional)</label>
            <input type="text" value={industryInput} placeholder="e.g. Fintech, Healthcare, E-commerce..."
              onChange={e => setIndustryInput(e.target.value)} style={inputStyle} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={handleSaveName} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Check size={13} /> Save
              </button>
              <button className="btn-ghost" onClick={() => setEditingName(false)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Name', value: activeClient.name },
              { label: 'Industry', value: activeClient.industry || '-' },
              { label: 'Client ID', value: activeClientId },
              { label: 'Added', value: new Date(activeClient.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 80, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: label === 'Client ID' ? 'monospace' : undefined }}>{value}</span>
              </div>
            ))}
            {saved && <p style={{ fontSize: 12, color: 'var(--green)' }}>✓ Saved</p>}
          </div>
        )}
      </div>

      {/* SDF classification */}
      <div className="card" style={{ padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ShieldCheck size={14} color="var(--amber)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Entity classification</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
          Significant Data Fiduciaries are designated by Central Government gazette notification under Section 10(1). Toggling this on adds the four SDF-specific obligations to the tracker for this client. Use the SDF Assessment page to evaluate designation risk.
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div onClick={() => setIsSdf(!isSdf)} style={{ width: 40, height: 22, borderRadius: 11, position: 'relative', cursor: 'pointer', transition: 'background 0.2s', background: isSdf ? 'var(--amber)' : 'var(--border-bright)' }}>
            <div style={{ position: 'absolute', top: 3, width: 16, height: 16, borderRadius: '50%', background: '#0a0a0f', transition: 'transform 0.2s', transform: isSdf ? 'translateX(21px)' : 'translateX(3px)' }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>This client is a Significant Data Fiduciary</span>
        </label>
        {isSdf && (
          <div style={{ marginTop: 12, background: 'var(--purple-bg)', border: '1px solid var(--purple-border)', borderRadius: 8, padding: '10px 14px' }}>
            <p style={{ fontSize: 12, color: '#d8b4fe', lineHeight: 1.5 }}>SDF-specific obligations (DPO appointment, data audits, algorithmic due diligence, data localisation) are now included in this client's tracker.</p>
          </div>
        )}
      </div>

      {/* All clients summary */}
      <div className="card" style={{ padding: 20, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Building2 size={14} color="var(--text-muted)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>All clients ({clients.length})</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
          Add or switch clients from the dropdown in the sidebar. Each client has independent obligation statuses, breach logs, and rights request logs.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {clients.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < clients.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: c.id === activeClientId ? 600 : 400, color: c.id === activeClientId ? 'var(--amber-bright)' : 'var(--text-secondary)' }}>{c.name}</span>
                {c.is_sdf && <span style={{ fontSize: 10, color: 'var(--purple)', marginLeft: 8 }}>SDF</span>}
              </div>
              {c.id === activeClientId && <span style={{ fontSize: 10, color: 'var(--amber)', background: 'var(--amber-bg)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--amber-border)' }}>Active</span>}
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Info size={14} color="var(--text-muted)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>About</span>
        </div>
        {[
          ['Version', 'DPDP Compliance Tracker v1.2'],
          ['Coverage', 'DPDP Act 2023 · DPDP Rules 2025 (G.S.R. 846(E))'],
          ['Storage', 'Browser localStorage - keyed per client'],
          ['Playbook', 'See About & Playbook in the sidebar'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 7 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 80, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{value}</span>
          </div>
        ))}
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
          Internal compliance tracking tool only. Does not constitute legal advice.
        </p>
      </div>
    </div>
  )
}
