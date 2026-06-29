// Type definitions for the DPDP tracker
// Supabase has been removed -- all data is stored in localStorage

export type ObligationCategory =
  | 'notice'
  | 'consent'
  | 'data_principal_rights'
  | 'data_fiduciary_duties'
  | 'sdf_specific'
  | 'breach_notification'
  | 'cross_border_transfer'
  | 'consent_manager'

export type PenaltyTier = 'critical' | 'high' | 'medium' | 'low'
export type ObligationStatus = 'pending' | 'in_progress' | 'done' | 'not_applicable'

export interface Obligation {
  id: string
  title: string
  description: string
  section_reference: string
  category: ObligationCategory
  penalty_tier: PenaltyTier
  penalty_amount: string
  applies_to_sdf_only: boolean
  phase: 2 | 3 | 4
  created_at: string
}
