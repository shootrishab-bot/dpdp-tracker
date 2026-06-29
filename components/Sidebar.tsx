'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ListChecks, CalendarDays, ShieldAlert,
  AlertTriangle, Settings, Users, Shield, FileText, Timer,
  BookOpen, ChevronDown, Plus, Check, Trash2, Building2,
} from 'lucide-react'
import { useStore } from '@/lib/context'
import { useState, useRef, useEffect } from 'react'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/obligations', label: 'Obligations', icon: ListChecks },
  { href: '/commencement', label: 'Commencement', icon: Timer },
  { href: '/timeline', label: 'Timeline', icon: CalendarDays },
  { href: '/risk', label: 'Risk & Penalties', icon: ShieldAlert },
  { href: '/rights', label: 'Rights Requests', icon: Users },
  { href: '/breaches', label: 'Breach Log', icon: AlertTriangle },
  { href: '/sdf', label: 'SDF Assessment', icon: Shield },
  { href: '/audit', label: 'Audit Export', icon: FileText },
  { href: '/about', label: 'About & Playbook', icon: BookOpen },
  { href: '/creator', label: 'About the Creator', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

// Trackr logo mark — hexagonal shield with circuit line
function TrackrMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dark background */}
      <rect width="32" height="32" rx="8" fill="#0d1117"/>
      {/* Shield body */}
      <path d="M16 3L5 7.5V15.5C5 21.8 9.8 27.6 16 29C22.2 27.6 27 21.8 27 15.5V7.5L16 3Z"
        fill="#111420" stroke="#3b5bdb" strokeWidth="1.4"/>
      {/* Hourglass top cone */}
      <path d="M11.5 9.5H20.5L16.6 14.4H15.4L11.5 9.5Z" fill="#0ea5e9"/>
      {/* Hourglass bottom cone */}
      <path d="M11.5 22.5H20.5L16.6 17.6H15.4L11.5 22.5Z" fill="#38bdf8" fillOpacity="0.75"/>
      {/* Top bar */}
      <rect x="11" y="8.5" width="10" height="1.2" rx="0.6" fill="#748ffc"/>
      {/* Bottom bar */}
      <rect x="11" y="22.3" width="10" height="1.2" rx="0.6" fill="#748ffc"/>
      {/* Sand dot at waist */}
      <circle cx="16" cy="16" r="1.1" fill="#38bdf8"/>
    </svg>
  )
}

export { TrackrMark }

export default function Sidebar() {
  const pathname = usePathname()
  const { clients, activeClientId, activeClient, isSdf, score, switchClient, addClient, deleteClient } = useStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setAddingNew(false)
        setConfirmDelete(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleAddClient() {
    if (!newName.trim()) return
    addClient(newName.trim())
    setNewName('')
    setAddingNew(false)
    setDropdownOpen(false)
  }

  const isDefault = activeClient.name === 'Your Organisation' || activeClient.name === 'My Organisation'

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: 240,
      background: 'var(--bg-surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12, textDecoration: 'none' }}>
          <TrackrMark size={30} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-brand)' }}>Trackr</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--teal-bright)', background: 'var(--teal-bg)', border: '1px solid var(--teal-border)', padding: '1px 6px', borderRadius: 20, letterSpacing: '0.02em' }}>v1</span>
          </div>
        </Link>

        {/* Client switcher */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setDropdownOpen(o => !o); setAddingNew(false); setConfirmDelete(null) }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8,
              padding: '7px 10px', cursor: 'pointer', gap: 6,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
              <Building2 size={12} color="var(--teal)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: isDefault ? 'var(--text-muted)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                {activeClient.name}
              </span>
            </div>
            <ChevronDown size={12} color="var(--text-muted)" style={{ flexShrink: 0, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>

          {isSdf && (
            <span className="badge badge-purple" style={{ fontSize: 9, marginTop: 5, display: 'inline-block' }}>Significant Data Fiduciary</span>
          )}

          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10,
              zIndex: 100, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {clients.map(c => (
                  <div key={c.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                    background: c.id === activeClientId ? 'var(--teal-bg)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <button
                      onClick={() => { switchClient(c.id); setDropdownOpen(false) }}
                      style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', minWidth: 0 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {c.id === activeClientId && <Check size={11} color="var(--teal)" style={{ flexShrink: 0 }} />}
                        <span style={{ fontSize: 12, color: c.id === activeClientId ? 'var(--teal-bright)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.name}
                        </span>
                      </div>
                      {c.is_sdf && <span style={{ fontSize: 9, color: 'var(--purple)', marginLeft: c.id === activeClientId ? 17 : 0 }}>SDF</span>}
                    </button>
                    {clients.length > 1 && (
                      confirmDelete === c.id ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => { deleteClient(c.id); setConfirmDelete(null); setDropdownOpen(false) }}
                            style={{ fontSize: 10, color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                          <button onClick={() => setConfirmDelete(null)}
                            style={{ fontSize: 10, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(c.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0 }}>
                          <Trash2 size={11} />
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
              {addingNew ? (
                <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
                  <input autoFocus type="text" placeholder="Client / firm name" value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddClient(); if (e.key === 'Escape') setAddingNew(false) }}
                    style={{ width: '100%', padding: '6px 8px', fontSize: 12, marginBottom: 6, borderRadius: 6 }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-primary" onClick={handleAddClient} style={{ flex: 1, padding: '5px 0', fontSize: 11 }}>Add</button>
                    <button className="btn-ghost" onClick={() => { setAddingNew(false); setNewName('') }} style={{ flex: 1, padding: '5px 0', fontSize: 11 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingNew(true)}
                  style={{ width: '100%', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid var(--border)' }}>
                  <Plus size={12} color="var(--teal)" />
                  <span style={{ fontSize: 12, color: 'var(--teal)' }}>Add client</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`sidebar-link ${pathname === href ? 'active' : ''}`}>
            <Icon size={14} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Score */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Compliance</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--teal)' : 'var(--red)' }}>{score}%</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-fill ${score >= 80 ? 'progress-green' : 'progress-teal'}`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </aside>
  )
}
