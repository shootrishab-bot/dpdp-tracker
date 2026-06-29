'use client'

// Client management - allows a firm to track compliance for multiple client organisations.
// All data is stored in localStorage, keyed by client ID.
// The "active client" is the one currently being viewed.

export interface Client {
  id: string
  name: string
  is_sdf: boolean
  industry: string
  created_at: string
}

const CLIENTS_KEY = 'dpdp_clients'
const ACTIVE_CLIENT_KEY = 'dpdp_active_client'

export function clientStorageKey(clientId: string, key: string): string {
  return `dpdp_${clientId}_${key}`
}

export function loadClients(): Client[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CLIENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveClients(clients: Client[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
}

export function loadActiveClientId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACTIVE_CLIENT_KEY)
}

export function saveActiveClientId(id: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACTIVE_CLIENT_KEY, id)
}

export function createClient(name: string): Client {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || 'New Client',
    is_sdf: false,
    industry: '',
    created_at: new Date().toISOString(),
  }
}

export function deleteClientData(clientId: string) {
  if (typeof window === 'undefined') return
  const keys = ['statuses', 'notes', 'assignees', 'breaches', 'rights', 'org_name', 'is_sdf']
  keys.forEach(k => localStorage.removeItem(clientStorageKey(clientId, k)))
}
