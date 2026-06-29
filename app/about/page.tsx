'use client'

import { useState } from 'react'

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'commencement', label: 'Commencement dates' },
  { id: 'notice', label: 'Notice' },
  { id: 'consent', label: 'Consent' },
  { id: 'children', label: "Children's data" },
  { id: 'df-duties', label: 'Data Fiduciary duties' },
  { id: 'dp-rights', label: 'Data Principal rights' },
  { id: 'breach', label: 'Breach notification' },
  { id: 'cross-border', label: 'Cross-border transfer' },
  { id: 'sdf', label: 'SDF obligations' },
  { id: 'consent-manager', label: 'Consent Manager' },
  { id: 'penalties', label: 'Penalties' },
  { id: 'tracker-guide', label: 'Tracker guide' },
  { id: 'caveats', label: 'Accuracy notes' },
]

type BadgeType = 'critical' | 'high' | 'medium' | 'amber' | 'green' | 'blue' | 'purple' | '18m' | '1yr' | 'immediate' | 'sdf-notif'

function Badge({ type, children }: { type: BadgeType; children: string }) {
  const styles: Record<BadgeType, { bg: string; color: string; border: string }> = {
    critical: { bg: 'var(--red-bg)', color: '#fca5a5', border: 'var(--red-border)' },
    high: { bg: '#1a0d00', color: '#fdba74', border: '#2a1500' },
    medium: { bg: '#1a1200', color: '#fde68a', border: '#2a1f00' },
    amber: { bg: 'var(--amber-bg)', color: 'var(--amber-bright)', border: 'var(--amber-border)' },
    green: { bg: 'var(--green-bg)', color: '#6ee7b7', border: 'var(--green-border)' },
    blue: { bg: 'var(--blue-bg)', color: '#93c5fd', border: '#0a1a2a' },
    purple: { bg: 'var(--purple-bg)', color: '#d8b4fe', border: 'var(--purple-border)' },
    '18m': { bg: 'var(--blue-bg)', color: '#93c5fd', border: '#0a1a2a' },
    '1yr': { bg: 'var(--amber-bg)', color: 'var(--amber-bright)', border: 'var(--amber-border)' },
    immediate: { bg: 'var(--green-bg)', color: '#6ee7b7', border: 'var(--green-border)' },
    'sdf-notif': { bg: 'var(--purple-bg)', color: '#d8b4fe', border: 'var(--purple-border)' },
  }
  const s = styles[type]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20, border: `1px solid ${s.border}`, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function ObCard({ title, ref_, commencement, penalty, sdf, children }: {
  title: string; ref_: string; commencement: BadgeType; penalty: BadgeType; sdf?: boolean; children: string
}) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ref_}</p>
        </div>
        <div style={{ display: 'flex', gap: 5, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Badge type={penalty}>{penalty === 'critical' ? 'Up to ₹200-250 crore' : penalty === 'high' ? 'Up to ₹150 crore' : 'Up to ₹50 crore'}</Badge>
          {sdf && <Badge type="purple">SDF only</Badge>}
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{children}</p>
    </div>
  )
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 24 }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber)', marginBottom: 6 }}>{eyebrow}</p>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14, letterSpacing: '-0.01em' }}>{title}</h2>
      {children}
    </section>
  )
}

function Callout({ type, children }: { type: 'amber' | 'red' | 'blue' | 'green'; children: React.ReactNode }) {
  const colors = {
    amber: { bg: 'var(--amber-bg)', border: 'var(--amber-border)', color: 'var(--amber-bright)', icon: '⚠' },
    red: { bg: 'var(--red-bg)', border: 'var(--red-border)', color: '#fca5a5', icon: '🚨' },
    blue: { bg: 'var(--blue-bg)', border: '#0a1a2a', color: '#93c5fd', icon: 'ℹ' },
    green: { bg: 'var(--green-bg)', border: 'var(--green-border)', color: '#6ee7b7', icon: '✓' },
  }[type]
  return (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.7, color: colors.color }}>
      <span style={{ flexShrink: 0 }}>{colors.icon}</span>
      <div>{children}</div>
    </div>
  )
}

function Def({ term, children }: { term: string; children: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 14, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber-bright)', paddingTop: 2 }}>{term}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{children}</span>
    </div>
  )
}

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('intro')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Inner sidebar */}
      <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', borderRight: '1px solid var(--border)', background: 'var(--bg-surface)', padding: '20px 10px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>Playbook</p>
        {sections.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={() => setActiveSection(s.id)}
            style={{
              display: 'block', padding: '6px 10px', borderRadius: 7, fontSize: 12, textDecoration: 'none', marginBottom: 1,
              color: activeSection === s.id ? 'var(--amber-bright)' : 'var(--text-secondary)',
              background: activeSection === s.id ? 'var(--amber-bg)' : 'transparent',
            }}
          >
            {s.label}
          </a>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '40px 52px', maxWidth: 820, overflowY: 'auto' }}>

        <Section id="intro" eyebrow="DPDP Compliance Tracker" title="Playbook & reference guide">
          <Callout type="red">
            This document is a compliance reference and internal working tool. It does not constitute legal advice. Consult qualified legal counsel for advice specific to your organisation.
          </Callout>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
            This playbook explains every obligation tracked in the DPDP Compliance Tracker, with citations to the exact provisions of the <strong style={{ color: 'var(--text-primary)' }}>Digital Personal Data Protection Act 2023</strong> (No. 22 of 2023) and the <strong style={{ color: 'var(--text-primary)' }}>DPDP Rules 2025</strong> (G.S.R. 846(E), 13 November 2025).
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge type="amber">DPDP Act 2023 (No. 22 of 2023)</Badge>
            <Badge type="blue">DPDP Rules 2025 (G.S.R. 846(E))</Badge>
            <Badge type="green">20 obligations · 8 categories</Badge>
          </div>
        </Section>

        <Section id="commencement" eyebrow="Rule 1(2), (3), (4) · MeitY Enforcement Notification" title="Commencement dates">
          <Callout type="amber">
            <strong>Gazette date: 13 November 2025.</strong> MeitY issued both the DPDP Rules 2025 and a separate Enforcement Notification on 13 November 2025, bringing specific Act provisions into force on a phased schedule under Section 1(2). There is no separate pending Act commencement.
          </Callout>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            {[
              { phase: 'Phase 1 · 13 November 2025', badge: 'immediate' as BadgeType, badge_label: 'Already in force', what: 'Act ss. 2, 18-26, 38, 44(1)&(3) · Rules 1, 2, 17-21', desc: 'Definitions, Board constitution and appointment, salary terms, meetings procedure, amendments to TRAI Act and RTI Act. Board constituted with four members in the NCR. No substantive Data Fiduciary obligations.' },
              { phase: 'Phase 2 · 13 November 2026', badge: '1yr' as BadgeType, badge_label: '13 Nov 2026', what: 'Act s. 6(9) · Rule 4 · First Schedule', desc: 'Consent Manager registration and obligations only. Board inquiry powers for Consent Manager breaches (Act s. 27(1)(d)).' },
              { phase: 'Phase 3 · 13 May 2027', badge: '18m' as BadgeType, badge_label: '13 May 2027', what: 'Act ss. 3-17 · Rules 3, 5-16, 22-23', desc: 'All substantive obligations - notice, consent, legitimate uses, security safeguards, breach notification, children\'s data, Data Principal rights, cross-border transfer, SDF obligations, exemptions.' },
            ].map((row, i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.phase}</span>
                    <Badge type={row.badge}>{row.badge_label}</Badge>
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--amber)', marginBottom: 4 }}>{row.what}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="notice" eyebrow="Section 5 · Rule 3 · Phase 3 (13 May 2027)" title="Notice obligations">
          <ObCard title="Provide notice before or at the time of seeking consent" ref_="Section 5(1) · Rule 3" commencement="18m" penalty="medium">
            The notice must: (a) be understandable independently of any other information; (b) give in clear and plain language an itemised description of personal data and the specified purpose; and (c) provide a link to withdraw consent, exercise rights, and complain to the Board. Rule 3(b)-(c).
          </ObCard>
          <ObCard title="Issue transitional notice to existing Data Principals" ref_="Section 5(2) · Rule 3" commencement="18m" penalty="medium">
            Where a Data Principal consented before Act commencement and processing continues, the Data Fiduciary must as soon as reasonably practicable give notice of: (i) the data and purpose; (ii) how to exercise rights; and (iii) how to complain to the Board. Processing may continue until notice is given and acted upon.
          </ObCard>
          <ObCard title="Give the option to receive notice in Eighth Schedule languages" ref_="Section 5(3)" commencement="18m" penalty="medium">
            The Data Fiduciary must give the Data Principal the option to receive the notice in English or any language in the Eighth Schedule to the Constitution of India.
          </ObCard>
        </Section>

        <Section id="consent" eyebrow="Sections 6-7 · Phase 3 (13 May 2027)" title="Consent obligations">
          <Callout type="blue">
            Sections 6(1)-(8) and (10) and Section 7 come into force on 13 May 2027. Section 6(9) - Consent Manager registration - is Phase 2, commencing 13 November 2026.
          </Callout>
          <ObCard title="Obtain free, specific, informed, unconditional and unambiguous consent" ref_="Section 6(1), Section 6(3), Section 6(10)" commencement="18m" penalty="medium">
            Consent must be given by a clear affirmative action and limited to data necessary for the specified purpose. The consent request must be in clear and plain language, offer Eighth Schedule language options, and provide DPO or authorised contact details. Where disputed, the burden of proving notice and consent lies on the Data Fiduciary - Section 6(10).
          </ObCard>
          <ObCard title="Enable withdrawal of consent with comparable ease" ref_="Section 6(4), Section 6(5)" commencement="18m" penalty="medium">
            The ease of withdrawing consent must be comparable to the ease of giving it. Consequences of withdrawal - including service cessation - are borne by the Data Principal. Withdrawal does not affect the legality of processing before withdrawal.
          </ObCard>
          <ObCard title="Cease processing and cause Data Processors to cease upon withdrawal" ref_="Section 6(6)" commencement="18m" penalty="medium">
            Within a reasonable time of withdrawal, the Data Fiduciary must cease and cause all Data Processors to cease processing - unless continued processing is authorised under the Act, Rules, or any other Indian law.
          </ObCard>
          <ObCard title="Document legitimate use grounds where processing is without consent" ref_="Section 7" commencement="18m" penalty="medium">
            Nine legitimate uses permit processing without consent: voluntary provision of data, State functions, State performance under law, legal disclosure obligations, court orders, medical emergencies, epidemic response, disaster response, and employment purposes. Processing must genuinely fall within one of these.
          </ObCard>
        </Section>

        <Section id="children" eyebrow="Section 9 · Rules 10-12 · Fourth Schedule · Phase 3" title="Children's data obligations">
          <Callout type="red">
            <strong>Separate ₹200 crore penalty row.</strong> Schedule 2, item 3 imposes up to ₹200 crore specifically for breach of Section 9. This is not subsumed in the general "any other provision" row.
          </Callout>
          <ObCard title="Obtain verifiable parental consent before processing children's personal data" ref_="Section 9(1) · Rule 10 · Rule 11" commencement="18m" penalty="critical">
            Before processing personal data of a child (under 18) or a person with disability with a lawful guardian, the Data Fiduciary must obtain verifiable parental/guardian consent. Rule 10 requires verifying the parent is an identifiable adult by reference to held identity details, voluntarily provided details, or a virtual token from an authorised entity or Digital Locker.
          </ObCard>
          <ObCard title="Do not process children's data detrimentally or track and target children" ref_="Section 9(2), Section 9(3) · Rule 12 · Fourth Schedule" commencement="18m" penalty="critical">
            Section 9(2) prohibits processing likely to cause detrimental effect on a child's well-being. Section 9(3) prohibits behavioural tracking and targeted advertising directed at children - regardless of whether parental consent was obtained. Exemptions in Rule 12 and Fourth Schedule cover healthcare providers, educational institutions, crèches, transport operators for safety purposes, and specified government functions.
          </ObCard>
        </Section>

        <Section id="df-duties" eyebrow="Section 8 · Rules 6-9 · Rule 14 · Phase 3 (13 May 2027)" title="Data Fiduciary duties">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>All of Section 8 comes into force on 13 May 2027 per the MeitY Enforcement Notification.</p>
          <ObCard title="Be responsible for compliance including by Data Processors" ref_="Section 8(1)" commencement="18m" penalty="medium">
            The Data Fiduciary is responsible for complying with the Act and Rules in respect of all processing - including by Data Processors - irrespective of any agreement to the contrary. A breach by a processor is attributed to the Fiduciary.
          </ObCard>
          <ObCard title="Engage Data Processors only under a valid contract" ref_="Section 8(2) · Rule 6(1)(f)" commencement="18m" penalty="medium">
            Data Processors may only be engaged under a valid contract containing appropriate provisions requiring the processor to take reasonable security safeguards - Rule 6(1)(f).
          </ObCard>
          <ObCard title="Ensure data accuracy when used for decisions or shared with other Data Fiduciaries" ref_="Section 8(3)" commencement="18m" penalty="medium">
            Where personal data is used to make a decision affecting the Data Principal or is shared with another Data Fiduciary, the processing Data Fiduciary must ensure completeness, accuracy and consistency.
          </ObCard>
          <ObCard title="Implement appropriate technical and organisational measures" ref_="Section 8(4)" commencement="18m" penalty="medium">
            The general organisational compliance obligation - policies, procedures, governance structures and measures for effective observance of the Act and Rules.
          </ObCard>
          <ObCard title="Implement reasonable security safeguards to prevent breaches" ref_="Section 8(5) · Rule 6" commencement="18m" penalty="critical">
            Rule 6(1) minimum safeguards: (a) encryption/obfuscation/masking/virtual tokens; (b) access controls; (c) logging and monitoring for detection and investigation; (d) data backups for continuity; (e) log retention for at least one year; (f) contractual processor security clauses; (g) appropriate technical and organisational measures. This carries the highest penalty - up to ₹250 crore.
          </ObCard>
          <ObCard title="Erase personal data when purpose is fulfilled or consent withdrawn" ref_="Section 8(7), Section 8(8) · Rule 8" commencement="18m" penalty="medium">
            Erase on consent withdrawal or when purpose is no longer served, whichever is earlier. Rule 8 requires minimum 1-year retention of processing logs. Large e-commerce, gaming, and social media platforms (2 crore+ or 50 lakh+ users) must erase data after 3 years of inactivity under the Third Schedule. 48-hour advance notice to the Data Principal before inactivity-triggered erasure - Rule 8(2).
          </ObCard>
          <ObCard title="Publish business contact information of DPO or authorised person" ref_="Section 8(9) · Rule 9" commencement="18m" penalty="medium">
            Must be prominently published on the website or app and included in every response to a Data Principal's communication for exercise of rights - Rule 9.
          </ObCard>
          <ObCard title="Establish an effective grievance redressal mechanism" ref_="Section 8(10) · Section 13 · Rule 14(3)" commencement="18m" penalty="medium">
            Must respond to grievances within a maximum of 90 days - Rule 14(3). The Data Principal must exhaust this before approaching the Board - Section 13(3).
          </ObCard>
        </Section>

        <Section id="dp-rights" eyebrow="Sections 11-14 · Rule 14 · Phase 3 (13 May 2027)" title="Data Principal rights">
          <Callout type="blue">
            <strong>No specific response deadline prescribed.</strong> The Act and Rules 2025 do not prescribe a fixed day-count for responding to Sections 11-14 requests. Rule 14(3) sets a 90-day maximum for grievances under Section 13. Timelines for rights requests will be prescribed by the Board. The tracker records dates received and responded - it does not apply a fabricated deadline.
          </Callout>
          <ObCard title="Respond to access requests" ref_="Section 11 · Rule 14" commencement="18m" penalty="medium">
            On request: (a) summary of personal data being processed and processing activities; (b) identities of all Data Fiduciaries and Processors with whom data was shared; (c) any other prescribed information. Exemption for sharing with law enforcement entities authorised in writing - Section 11(2).
          </ObCard>
          <ObCard title="Respond to correction, completion, updating and erasure requests" ref_="Section 12 · Rule 14" commencement="18m" penalty="medium">
            Correct inaccurate/misleading data, complete incomplete data, update data - Section 12(2). Erase on erasure request unless retention is necessary for specified purpose or legal compliance - Section 12(3).
          </ObCard>
          <ObCard title="Enable nomination of another individual to exercise rights" ref_="Section 14 · Rule 14(4)" commencement="18m" penalty="medium">
            A Data Principal may nominate another individual to exercise their rights on death or incapacity (unsoundness of mind or infirmity of body - Section 14(2)).
          </ObCard>
          <ObCard title="Publish means for exercise of all Data Principal rights" ref_="Rule 14(1)" commencement="18m" penalty="medium">
            Prominently publish on website or app: (a) the means for making rights requests; and (b) the particulars required to identify the Data Principal (username, customer ID, email, mobile number, etc.).
          </ObCard>
        </Section>

        <Section id="breach" eyebrow="Section 8(6) · Rule 7 · Phase 3 (13 May 2027)" title="Breach notification">
          <Callout type="red">
            <strong>Two separate obligations, two different standards.</strong> Rule 7(1) - notify Data Principals without delay (no hour count). Rule 7(2) - notify the Board: preliminary description without delay, detailed report within 72 hours of awareness.
          </Callout>
          <ObCard title="Notify affected Data Principals without delay" ref_="Section 8(6) · Rule 7(1)" commencement="18m" penalty="critical">
            Notify each affected Data Principal through their user account or registered communication channel: (a) nature, extent and timing of breach; (b) likely consequences relevant to them; (c) measures taken to mitigate risk; (d) safety measures they can take; (e) contact information for queries. Standard: without delay. No specific hour count.
          </ObCard>
          <ObCard title="Notify the Board - preliminary without delay, detailed within 72 hours" ref_="Section 8(6) · Rule 7(2)" commencement="18m" penalty="critical">
            Stage 1 (without delay): preliminary description of breach, nature, extent, timing, location, likely impact. Stage 2 (within 72 hours of awareness): updated detailed information, causes, mitigation measures, findings on the person responsible, remedial measures to prevent recurrence, report on Data Principal notifications. The Board may extend the 72-hour deadline on written request.
          </ObCard>
        </Section>

        <Section id="cross-border" eyebrow="Section 16(1) · Rule 15 · Phase 3 (13 May 2027)" title="Cross-border data transfer">
          <ObCard title="Comply with Central Government restrictions on cross-border transfers" ref_="Section 16(1) · Rule 15" commencement="18m" penalty="medium">
            Section 16(1) is a restriction power - the Central Government may by notification restrict transfers to specified countries (a blacklist, not a whitelist). Rule 15 additionally requires compliance with requirements the Government may specify by order regarding transfers to foreign States or entities under their control. No restriction notification and no requirements order has been issued as of June 2026. Audit existing cross-border data flows and monitor MeitY notifications.
          </ObCard>
        </Section>

        <Section id="sdf" eyebrow="Section 10 · Rule 13 · On SDF designation notification" title="Significant Data Fiduciary obligations">
          <Callout type="amber">
            SDF designation is made by Central Government gazette notification under Section 10(1) - no organisation self-designates. The six Section 10(1) factors: (a) volume and sensitivity; (b) risk to rights; (c) sovereignty and integrity; (d) electoral democracy; (e) security of State; (f) public order.
          </Callout>
          <ObCard title="Appoint a Data Protection Officer based in India" ref_="Section 10(2)(a)" commencement="sdf-notif" penalty="high" sdf>
            The DPO must: (i) represent the SDF under the Act; (ii) be based in India; (iii) be responsible to the Board of Directors or similar governing body; and (iv) be the point of contact for grievance redressal.
          </ObCard>
          <ObCard title="Appoint an independent data auditor and conduct annual DPIA and audit" ref_="Section 10(2)(b), Section 10(2)(c)(i) · Rule 13(1), Rule 13(2)" commencement="sdf-notif" penalty="high" sdf>
            Annual DPIA and audit from the date of SDF notification - Rule 13(1). Auditor must furnish a report of significant observations to the Board - Rule 13(2). DPIA must cover: Data Principal rights, purpose of processing, and risk assessment.
          </ObCard>
          <ObCard title="Verify algorithmic and technical measures do not pose risk to Data Principal rights" ref_="Section 10(2)(c)(iii) · Rule 13(3)" commencement="sdf-notif" penalty="high" sdf>
            Ongoing due diligence obligation - not a one-time deployment assessment. Must verify that algorithmic software used for hosting, display, storage, transmission or sharing of personal data does not pose a risk to Data Principal rights.
          </ObCard>
          <ObCard title="Ensure notified personal data is not transferred outside India (SDF data localisation)" ref_="Rule 13(4)" commencement="sdf-notif" penalty="high" sdf>
            Data localisation obligation applicable to categories of data specified by the Government following MeitY committee recommendations. No such order issued as of June 2026.
          </ObCard>
        </Section>

        <Section id="consent-manager" eyebrow="Section 6(9) · Rule 4 · Phase 2 (13 November 2026)" title="Consent Manager">
          <ObCard title="Register with the Board before acting as a Consent Manager" ref_="Section 6(9) · Rule 4 · First Schedule Part A" commencement="1yr" penalty="medium">
            Registration conditions (First Schedule Part A): company incorporated in India; sufficient technical, operational and financial capacity; net worth ≥ ₹2 crore; sound management; independent certification of interoperable platform against Board standards. Consent Managers must act in a fiduciary capacity toward Data Principals and maintain independence from Data Fiduciaries. Most organisations are not Consent Managers - mark as N/A if not applicable.
          </ObCard>
        </Section>

        <Section id="penalties" eyebrow="Schedule 2 · Section 33" title="Penalty schedule">
          <Callout type="amber">
            All amounts are statutory maxima per instance. The Board determines actual penalties after adjudication considering the Section 33(2) factors: nature, gravity and duration; type of data; repetitiveness; gain or loss avoidance; mitigative action; proportionality; likely impact. Sums credited to the Consolidated Fund of India - Section 34.
          </Callout>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)' }}>
                  {['Item', 'Breach', 'Maximum penalty'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { item: '1', breach: 'Failure to take reasonable security safeguards - Section 8(5)', penalty: 'Up to ₹250 crore', color: '#fca5a5' },
                  { item: '2', breach: 'Failure to notify Board or Data Principals of a breach - Section 8(6)', penalty: 'Up to ₹200 crore', color: '#fca5a5' },
                  { item: '3', breach: 'Breach of children\'s data obligations - Section 9', penalty: 'Up to ₹200 crore', color: '#fca5a5' },
                  { item: '4', breach: 'Breach of SDF additional obligations - Section 10', penalty: 'Up to ₹150 crore', color: '#fdba74' },
                  { item: '5', breach: 'Breach of Data Principal duties - Section 15', penalty: 'Up to ₹10,000', color: '#fde68a' },
                  { item: '6', breach: 'Breach of voluntary undertaking - Section 32', penalty: 'Up to the applicable amount', color: 'var(--text-secondary)' },
                  { item: '7', breach: 'Breach of any other provision of the Act or Rules', penalty: 'Up to ₹50 crore', color: '#fde68a' },
                ].map((row, i, arr) => (
                  <tr key={row.item}>
                    <td style={{ padding: '11px 14px', color: 'var(--text-muted)', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', verticalAlign: 'top' }}>{row.item}</td>
                    <td style={{ padding: '11px 14px', color: 'var(--text-secondary)', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', verticalAlign: 'top' }}>{row.breach}</td>
                    <td style={{ padding: '11px 14px', color: row.color, fontWeight: 600, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="tracker-guide" eyebrow="Feature guide" title="Page-by-page guide">
          {[
            { icon: '📊', path: '/', title: 'Dashboard', body: 'Compliance score, critical obligations alert, category breakdown, phase rings, commencement countdown, open rights requests, active breach entries, and quick actions. Score formula: (Done + N/A) ÷ Total × 100.' },
            { icon: '✅', path: '/obligations', title: 'Obligations', body: 'Full register of 20 obligations (up to 24 if SDF). Filter by status, category, penalty tier, or search. Click to expand - add assignee, notes, and update status. Use N/A only if the obligation genuinely does not apply.' },
            { icon: '⏱', path: '/commencement', title: 'Commencement timers', body: 'Live flip-clock countdowns to 13 November 2026 (Consent Manager) and 13 May 2027 (all substantive obligations). Obligations grouped by commencement date with days remaining per pending obligation.' },
            { icon: '📅', path: '/timeline', title: 'Timeline', body: 'Obligations in two phases: Phase 1 (general obligations, 13 May 2027) and Phase 2 (SDF obligations, on SDF designation notification). Per-phase completion percentage and obligation status list.' },
            { icon: '🛡', path: '/risk', title: 'Risk & Penalties', body: 'Unaddressed obligations grouped by penalty tier. Disappears from view once marked Done or N/A. Use to brief senior management or triage remediation effort.' },
            { icon: '👤', path: '/rights', title: 'Rights Requests', body: 'Log Data Principal requests (access, correction, erasure, nomination, grievance). Records date received and date responded. Days-open counter shown for unresolved requests. No fabricated deadline applied.' },
            { icon: '🚨', path: '/breaches', title: 'Breach Log', body: 'Two-stage Board notification tracker per Rule 7: preliminary (without delay) and detailed (within 72 hours). Flags detailed report if over 72 hours elapsed since awareness. Tracks Data Principal notification separately.' },
            { icon: '🔍', path: '/sdf', title: 'SDF Assessment', body: 'Six questions mapping exactly to Section 10(1)(a)-(f) factors. Preliminary self-assessment only - SDF designation requires a gazette notification. Answering yes to any factor enables SDF obligations in the tracker.' },
            { icon: '📄', path: '/audit', title: 'Audit Export', body: 'Full compliance report: executive summary, obligations register with assignees and notes, category breakdown, rights log, breach log. Download as HTML, print to PDF in Chrome with Ctrl+P.' },
            { icon: '⚙️', path: '/settings', title: 'Settings', body: 'Rename the active client, toggle SDF status, manage clients. All data is stored in browser localStorage keyed by client ID. Clearing browser data clears the tracker.' },
          ].map(item => (
            <div key={item.path} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', marginBottom: 10 }}>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>{item.path}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{item.body}</p>
            </div>
          ))}
        </Section>

        <Section id="caveats" eyebrow="Accuracy and limitations" title="What this tracker does and does not do">
          {[
            { title: 'The Act has been notified - in phases', type: 'green' as const, body: 'The DPDP Act 2023 was brought into force by the MeitY Enforcement Notification of 13 November 2025 using Section 1(2). Phase 3 - all substantive obligations - commences 13 May 2027. This is a preparation tool to achieve compliance before that date.' },
            { title: 'The Data Protection Board has been constituted', type: 'green' as const, body: 'The Board has been constituted with four members in the NCR as of November 2025. However, its adjudicatory powers (other than for Consent Manager breaches) only become operative in Phase 3 (13 May 2027).' },
            { title: 'No SDF notifications have been issued', type: 'amber' as const, body: 'No organisation has been formally designated as an SDF as of June 2026. The SDF assessment is a preliminary self-assessment only. Consult legal counsel on designation risk.' },
            { title: 'No cross-border transfer restrictions or orders issued', type: 'amber' as const, body: 'No restriction notification under Section 16(1) and no requirements order under Rule 15 has been issued. Audit cross-border data flows and monitor MeitY notifications.' },
            { title: 'Rights request timelines not yet prescribed', type: 'amber' as const, body: 'The specific response deadline for Sections 11, 12 and 14 rights requests has not been prescribed. The tracker records dates but applies no fabricated deadline. Rule 14(3)\'s 90-day limit applies to Section 13 grievances specifically.' },
            { title: 'Penalty amounts are statutory maxima', type: 'amber' as const, body: 'All amounts are "up to" figures per Schedule 2 per instance. Actual penalties are determined by the Board after adjudication considering Section 33(2) factors.' },
            { title: 'This tracker is not legal advice', type: 'amber' as const, body: 'An internal compliance reference tool only. For legal advice on your organisation\'s specific obligations or designation risk, consult qualified legal counsel.' },
          ].map(item => (
            <Callout key={item.title} type={item.type}>
              <strong>{item.title}:</strong> {item.body}
            </Callout>
          ))}
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>Primary sources</p>
            {[
              'Digital Personal Data Protection Act, 2023 (No. 22 of 2023) - Presidential assent 11 August 2023',
              'Digital Personal Data Protection Rules, 2025 - G.S.R. 846(E), MeitY, 13 November 2025',
              'MeitY Enforcement Notification (GSR 843(E), 13 November 2025) - phased commencement of DPDP Act provisions under Section 1(2)',
              'Constitution of India - Eighth Schedule (scheduled languages)',
              'Telecom Regulatory Authority of India Act, 1997 - TDSAT appellate jurisdiction',
            ].map(s => (
              <p key={s} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: 14, borderLeft: '2px solid var(--amber)', marginBottom: 8 }}>{s}</p>
            ))}
          </div>
        </Section>

        <div style={{ height: 48 }} />
      </div>
    </div>
  )
}
