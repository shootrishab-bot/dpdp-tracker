'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ObligationStatus } from './supabase'
import { OBLIGATIONS } from './obligations-data'
import {
  loadClients, saveClients, loadActiveClientId, saveActiveClientId,
  createClient, deleteClientData, clientStorageKey,
  type Client,
} from './clients'

export type StatusMap = Record<string, ObligationStatus>
export type NotesMap = Record<string, string>
export type AssigneeMap = Record<string, string>

export interface BreachEntry {
  id: string
  title: string
  description: string
  date_discovered: string
  date_notified_board_preliminary: string | null
  date_notified_board_detailed: string | null
  date_notified_principals: string | null
  principals_affected: number
  status: 'discovered' | 'preliminary_sent' | 'detailed_sent' | 'principals_notified' | 'closed'
  created_at: string
}

export type RightsRequestType = 'access' | 'correction' | 'erasure' | 'nomination' | 'grievance'
export type RightsRequestStatus = 'open' | 'in_progress' | 'responded' | 'closed'

export interface RightsRequest {
  id: string
  type: RightsRequestType
  principal_name: string
  principal_email: string
  description: string
  date_received: string
  date_responded: string | null
  status: RightsRequestStatus
  notes: string
  created_at: string
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// Default single client for backwards compatibility
const DEFAULT_CLIENT: Client = {
  id: 'default',
  name: 'Your Organisation',
  is_sdf: false,
  industry: '',
  created_at: new Date().toISOString(),
}

export function useTrackerStore() {
  const [clients, setClients] = useState<Client[]>([])
  const [activeClientId, setActiveClientIdState] = useState<string>('default')
  const [statuses, setStatuses] = useState<StatusMap>({})
  const [notes, setNotes] = useState<NotesMap>({})
  const [assignees, setAssignees] = useState<AssigneeMap>({})
  const [breaches, setBreachesState] = useState<BreachEntry[]>([])
  const [rights, setRightsState] = useState<RightsRequest[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Derive active client
  const activeClient = clients.find(c => c.id === activeClientId) ?? DEFAULT_CLIENT
  const orgName = activeClient.name
  const isSdf = activeClient.is_sdf

  // Load all data for a given client ID
  function loadClientData(clientId: string) {
    const k = (key: string) => clientStorageKey(clientId, key)
    setStatuses(load(k('statuses'), {}))
    setNotes(load(k('notes'), {}))
    setAssignees(load(k('assignees'), {}))
    setBreachesState(load(k('breaches'), []))
    setRightsState(load(k('rights'), []))
  }

  useEffect(() => {
    // Load clients list - if empty, initialise with default
    let existingClients = loadClients()
    if (existingClients.length === 0) {
      // Migrate legacy single-client data
      const legacyName = load('dpdp_org_name', 'Your Organisation')
      const legacySdf = load('dpdp_is_sdf', false)
      const defaultClient: Client = {
        ...DEFAULT_CLIENT,
        name: legacyName,
        is_sdf: legacySdf,
      }
      existingClients = [defaultClient]
      saveClients(existingClients)

      // Migrate legacy keys to client-namespaced keys
      const legacyKeys = ['statuses', 'notes', 'assignees', 'breaches', 'rights']
      legacyKeys.forEach(key => {
        const legacyVal = localStorage.getItem(`dpdp_${key}`)
        if (legacyVal) {
          localStorage.setItem(clientStorageKey('default', key), legacyVal)
        }
      })
    }

    setClients(existingClients)

    const savedActiveId = loadActiveClientId()
    const resolvedId = existingClients.find(c => c.id === savedActiveId)
      ? savedActiveId!
      : existingClients[0].id

    setActiveClientIdState(resolvedId)
    loadClientData(resolvedId)
    setHydrated(true)
  }, [])

  // Switch active client
  const switchClient = useCallback((clientId: string) => {
    setActiveClientIdState(clientId)
    saveActiveClientId(clientId)
    loadClientData(clientId)
  }, [])

  // Add new client
  const addClient = useCallback((name: string) => {
    const newClient = createClient(name)
    setClients(prev => {
      const next = [...prev, newClient]
      saveClients(next)
      return next
    })
    // Switch to new client
    setActiveClientIdState(newClient.id)
    saveActiveClientId(newClient.id)
    setStatuses({})
    setNotes({})
    setAssignees({})
    setBreachesState([])
    setRightsState([])
    return newClient
  }, [])

  // Update client name or SDF status
  const updateClient = useCallback((clientId: string, updates: Partial<Pick<Client, 'name' | 'is_sdf' | 'industry'>>) => {
    setClients(prev => {
      const next = prev.map(c => c.id === clientId ? { ...c, ...updates } : c)
      saveClients(next)
      return next
    })
  }, [])

  // Delete a client and all their data
  const deleteClient = useCallback((clientId: string) => {
    deleteClientData(clientId)
    setClients(prev => {
      const next = prev.filter(c => c.id !== clientId)
      saveClients(next)
      // If we deleted the active client, switch to first remaining
      if (clientId === activeClientId && next.length > 0) {
        setActiveClientIdState(next[0].id)
        saveActiveClientId(next[0].id)
        loadClientData(next[0].id)
      }
      return next
    })
  }, [activeClientId])

  // Per-client data setters
  const k = (key: string) => clientStorageKey(activeClientId, key)

  const setStatus = useCallback((id: string, status: ObligationStatus) => {
    setStatuses(prev => {
      const next = { ...prev, [id]: status }
      save(clientStorageKey(activeClientId, 'statuses'), next)
      return next
    })
  }, [activeClientId])

  const setNote = useCallback((id: string, note: string) => {
    setNotes(prev => {
      const next = { ...prev, [id]: note }
      save(clientStorageKey(activeClientId, 'notes'), next)
      return next
    })
  }, [activeClientId])

  const setAssignee = useCallback((id: string, assignee: string) => {
    setAssignees(prev => {
      const next = { ...prev, [id]: assignee }
      save(clientStorageKey(activeClientId, 'assignees'), next)
      return next
    })
  }, [activeClientId])

  const setOrgName = useCallback((name: string) => {
    updateClient(activeClientId, { name })
  }, [activeClientId, updateClient])

  const setIsSdf = useCallback((val: boolean) => {
    updateClient(activeClientId, { is_sdf: val })
  }, [activeClientId, updateClient])

  const addBreach = useCallback((breach: Omit<BreachEntry, 'id' | 'created_at'>) => {
    setBreachesState(prev => {
      const entry: BreachEntry = { ...breach, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      const next = [entry, ...prev]
      save(clientStorageKey(activeClientId, 'breaches'), next)
      return next
    })
  }, [activeClientId])

  const updateBreach = useCallback((id: string, updates: Partial<BreachEntry>) => {
    setBreachesState(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updates } : b)
      save(clientStorageKey(activeClientId, 'breaches'), next)
      return next
    })
  }, [activeClientId])

  const deleteBreach = useCallback((id: string) => {
    setBreachesState(prev => {
      const next = prev.filter(b => b.id !== id)
      save(clientStorageKey(activeClientId, 'breaches'), next)
      return next
    })
  }, [activeClientId])

  const addRightsRequest = useCallback((req: Omit<RightsRequest, 'id' | 'created_at'>) => {
    setRightsState(prev => {
      const entry: RightsRequest = { ...req, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      const next = [entry, ...prev]
      save(clientStorageKey(activeClientId, 'rights'), next)
      return next
    })
  }, [activeClientId])

  const updateRightsRequest = useCallback((id: string, updates: Partial<RightsRequest>) => {
    setRightsState(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updates } : r)
      save(clientStorageKey(activeClientId, 'rights'), next)
      return next
    })
  }, [activeClientId])

  const deleteRightsRequest = useCallback((id: string) => {
    setRightsState(prev => {
      const next = prev.filter(r => r.id !== id)
      save(clientStorageKey(activeClientId, 'rights'), next)
      return next
    })
  }, [activeClientId])

  const relevantObligations = OBLIGATIONS.filter(o => isSdf || !o.applies_to_sdf_only)

  const complianceStats = {
    total: relevantObligations.length,
    done: relevantObligations.filter(o => statuses[o.id] === 'done').length,
    in_progress: relevantObligations.filter(o => statuses[o.id] === 'in_progress').length,
    pending: relevantObligations.filter(o => !statuses[o.id] || statuses[o.id] === 'pending').length,
    not_applicable: relevantObligations.filter(o => statuses[o.id] === 'not_applicable').length,
    critical_pending: relevantObligations.filter(
      o => o.penalty_tier === 'critical' && (!statuses[o.id] || statuses[o.id] === 'pending')
    ).length,
  }

  const score = complianceStats.total > 0
    ? Math.round(((complianceStats.done + complianceStats.not_applicable) / complianceStats.total) * 100)
    : 0

  return {
    // Client management
    clients, activeClientId, activeClient,
    switchClient, addClient, updateClient, deleteClient,
    // Per-client state
    statuses, notes, assignees, orgName, isSdf, breaches, rights, hydrated,
    setStatus, setNote, setAssignee, setOrgName, setIsSdf,
    addBreach, updateBreach, deleteBreach,
    addRightsRequest, updateRightsRequest, deleteRightsRequest,
    relevantObligations, complianceStats, score,
  }
}
