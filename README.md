# DPDP Compliance Tracker

A compliance tracking tool for legal and compliance teams implementing the **Digital Personal Data Protection Act 2023** and **DPDP Rules 2025**.

## Features

- **Dashboard** — compliance score, category breakdown, phase summary, critical gaps alert
- **Obligations tracker** — full checklist of 23 obligations across 9 categories, filterable by status, phase, category, and penalty tier
- **Timeline** — obligations grouped by implementation phase (commencement, 6 months, 12 months)
- **Risk and penalties** — gap analysis sorted by Schedule 1 penalty exposure (up to ₹250 crore)
- **Breach log** — record breaches, track 72-hour Board notification deadline, log Data Principal notifications
- **Settings** — configure organisation name and SDF classification (toggles SDF-specific obligations)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Data is stored in **browser localStorage** for the MVP — no backend required to get started.

## Migrating to Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `SUPABASE_SCHEMA.sql` in the Supabase SQL editor
3. Copy your project URL and anon key into `.env.local`
4. Replace the `localStorage` calls in `lib/store.ts` with Supabase queries using the client in `lib/supabase.ts`

## Obligation coverage

| Category | Obligations | Key sections |
|---|---|---|
| Notice | 3 | Section 5, Rule 3 |
| Consent | 4 | Section 6, Rule 7 |
| Data Principal Rights | 4 | Sections 11-14, Rule 12 |
| Data Fiduciary Duties | 5 | Sections 8-10, Rule 21-22 |
| SDF-Specific | 4 | Section 10, Rules 19-20 |
| Breach Notification | 2 | Section 8(6), Rule 22 |
| Cross-Border Transfer | 2 | Section 16, Rules 17-18 |
| DPO / Contact Point | 1 | Section 8(8), Rule 13 |
| Consent Manager | 1 | Section 6(7), Rule 5 |

SDF-specific obligations are hidden unless the organisation is marked as an SDF in Settings.

## Disclaimer

This tool is for internal compliance tracking only. It does not constitute legal advice.
