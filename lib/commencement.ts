// Gazette notification date: 13 November 2025
// Source: G.S.R. 846(E), Ministry of Electronics and Information Technology
// Enforcement Notification: MeitY, 13 November 2025 (separate notification
// bringing specific provisions of the DPDP Act 2023 into force on phased basis)

const GAZETTE_DATE = new Date('2025-11-13T00:00:00.000+05:30')

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

// Three fixed commencement dates - all derived from the 13 November 2025 gazette date.
// Source: Rule 1(2), (3), (4) of DPDP Rules 2025 read with the MeitY Enforcement
// Notification of 13 November 2025 which brought corresponding Act sections into force.
export const RULE_COMMENCEMENT = {
  // Phase 1 - 13 November 2025 (gazette date)
  // Act sections: 2, 18-26, 38, 44(1) and (3)
  // Rules: 1, 2, 17-21
  immediate: new Date('2025-11-13T00:00:00.000+05:30'),

  // Phase 2 - 13 November 2026 (one year after gazette)
  // Act sections: 6(9), 27(1)(d)
  // Rule: 4
  oneYear: addMonths(GAZETTE_DATE, 12),

  // Phase 3 - 13 May 2027 (eighteen months after gazette)
  // Act sections: 3-16, 17 and all remaining provisions
  // Rules: 3, 5-16, 22-23
  // This covers ALL substantive Data Fiduciary obligations - notice, consent,
  // legitimate uses, security safeguards, breach notification, children's data,
  // Data Principal rights, cross-border transfer, SDF obligations, exemptions.
  eighteenMonths: addMonths(GAZETTE_DATE, 18),

  // SDF obligations - additionally conditional on Central Government gazette
  // notification designating the organisation as an SDF under Section 10(1).
  // No fixed date.
  sdfNotification: null as Date | null,
}

export type RuleGroup =
  | 'immediate'        // Phase 1 - 14 Nov 2025 - Board constitution only, no DF obligations
  | 'oneYear'          // Phase 2 - 13 Nov 2026 - Consent Manager registration only
  | 'eighteenMonths'   // Phase 3 - 13 May 2027 - All substantive DF obligations
  | 'sdfNotification'  // SDF-specific - additionally requires Section 10(1) designation notification

// Maps each obligation ID to its commencement group.
// All substantive Data Fiduciary obligations - whether derived from the Act alone
// or from Act + implementing Rule - come into force on 13 May 2027 under the
// MeitY Enforcement Notification and Rule 1(4). There is no separate "Act only"
// commencement category: the Enforcement Notification brought Act sections into
// force on the same phased schedule as the Rules.
export const OBLIGATION_RULE_GROUP: Record<string, RuleGroup> = {
  // NOTICE - Section 5 + Rule 3 - Phase 3 (13 May 2027)
  'notice-001': 'eighteenMonths',
  'notice-002': 'eighteenMonths',
  'notice-003': 'eighteenMonths', // Section 5(3) - brought into force with Section 5

  // CONSENT - Sections 6(1)-(8), (10) and Section 7 - Phase 3 (13 May 2027)
  // Note: Section 6(9) (Consent Manager registration) is Phase 2 - covered by cm-001
  'consent-001': 'eighteenMonths',
  'consent-002': 'eighteenMonths',
  'consent-003': 'eighteenMonths',
  'consent-004': 'eighteenMonths',

  // CHILDREN - Section 9 + Rules 10-12 - Phase 3 (13 May 2027)
  'child-001': 'eighteenMonths',
  'child-002': 'eighteenMonths',

  // DATA FIDUCIARY DUTIES - Sections 8(1)-(10) + Rules 6-9, 14 - Phase 3 (13 May 2027)
  // All of Section 8 is brought into force on 13 May 2027 per the Enforcement Notification
  'df-001': 'eighteenMonths',
  'df-002': 'eighteenMonths',
  'df-003': 'eighteenMonths',
  'df-004': 'eighteenMonths',
  'df-005': 'eighteenMonths',
  'df-006': 'eighteenMonths',
  'df-007': 'eighteenMonths',
  'df-008': 'eighteenMonths',

  // DATA PRINCIPAL RIGHTS - Sections 11-14 + Rule 14 - Phase 3 (13 May 2027)
  'rights-001': 'eighteenMonths',
  'rights-002': 'eighteenMonths',
  'rights-003': 'eighteenMonths',
  'rights-004': 'eighteenMonths',

  // BREACH NOTIFICATION - Section 8(6) + Rule 7 - Phase 3 (13 May 2027)
  'breach-001': 'eighteenMonths',
  'breach-002': 'eighteenMonths',

  // CROSS-BORDER TRANSFER - Section 16 + Rule 15 - Phase 3 (13 May 2027)
  'cbt-001': 'eighteenMonths',

  // SDF - Section 10(2) + Rule 13 - Phase 3 (13 May 2027) AND Section 10(1) notification
  // SDF obligations require both Phase 3 commencement and a separate SDF designation gazette
  'sdf-001': 'sdfNotification',
  'sdf-002': 'sdfNotification',
  'sdf-003': 'sdfNotification',
  'sdf-004': 'sdfNotification',

  // CONSENT MANAGER - Section 6(9) + Rule 4 - Phase 2 (13 Nov 2026)
  'cm-001': 'oneYear',
}

export const RULE_GROUP_LABELS: Record<RuleGroup, string> = {
  immediate: 'In force - 13 November 2025',
  oneYear: 'In force - 13 November 2026',
  eighteenMonths: 'In force - 13 May 2027',
  sdfNotification: 'On SDF gazette notification (date TBC)',
}

export const RULE_GROUP_RULE: Record<RuleGroup, string> = {
  immediate: 'Act ss. 2, 18-26, 38, 44 · Rules 1, 2, 17-21',
  oneYear: 'Act s. 6(9) · Rule 4',
  eighteenMonths: 'Act ss. 3-17 · Rules 3, 5-16, 22-23',
  sdfNotification: 'Act s. 10(1) designation notification',
}

export const RULE_GROUP_COLORS: Record<RuleGroup, { accent: string; bg: string; border: string; label: string }> = {
  immediate: {
    accent: 'var(--green)',
    bg: 'var(--green-bg)',
    border: 'var(--green-border)',
    label: 'Already in force',
  },
  oneYear: {
    accent: 'var(--amber)',
    bg: 'var(--amber-bg)',
    border: 'var(--amber-border)',
    label: '13 Nov 2026',
  },
  eighteenMonths: {
    accent: 'var(--blue)',
    bg: 'var(--blue-bg)',
    border: '#0a1a2a',
    label: '13 May 2027',
  },
  sdfNotification: {
    accent: 'var(--purple)',
    bg: 'var(--purple-bg)',
    border: 'var(--purple-border)',
    label: 'SDF notification (TBC)',
  },
}

export function getCommencementDate(group: RuleGroup): Date | null {
  if (group === 'sdfNotification') return null
  return RULE_COMMENCEMENT[group] ?? null
}

export function getCountdown(targetDate: Date): {
  days: number
  hours: number
  minutes: number
  total_days: number
  past: boolean
} {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  const past = diff <= 0
  const abs = Math.abs(diff)
  const total_days = Math.floor(abs / 86400000)
  const days = total_days
  const hours = Math.floor((abs % 86400000) / 3600000)
  const minutes = Math.floor((abs % 3600000) / 60000)
  return { days, hours, minutes, total_days, past }
}
