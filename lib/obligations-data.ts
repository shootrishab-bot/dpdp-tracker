import type { Obligation } from './supabase'

// Phase values map to MeitY enforcement phases:
// Phase 2 = 13 November 2026 (Rule 4 / Consent Manager only)
// Phase 3 = 13 May 2027 (all substantive Data Fiduciary obligations)
// Phase 4 = On SDF gazette notification (SDF-specific obligations only)
// Phase 1 (13 Nov 2025) has no Data Fiduciary obligations - only Board constitution.

export const OBLIGATIONS: Omit<Obligation, 'created_at'>[] = [

  // ─── NOTICE - Phase 3 (13 May 2027) ─────────────────────────────────────────
  {
    id: 'notice-001',
    title: 'Provide notice before or at the time of seeking consent',
    description:
      'Every Data Fiduciary must give the Data Principal a notice before or at the time of seeking consent. Under Rule 3, the notice must: (a) be understandable independently of any other information; (b) give, in clear and plain language, an itemised description of the personal data to be processed and the specified purpose or purposes; and (c) provide a communication link through which the Data Principal can withdraw consent, exercise rights under the Act, and make a complaint to the Board.',
    section_reference: 'Section 5(1), Rule 3',
    category: 'notice',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'notice-002',
    title: 'Issue transitional notice to existing Data Principals',
    description:
      'Where a Data Principal gave consent before the Act commenced and the Data Fiduciary continues to process that personal data, the Data Fiduciary must, as soon as reasonably practicable, give a notice informing the Data Principal of: (i) the personal data and purpose for which it has been processed; (ii) how rights under Section 6(4) and Section 13 may be exercised; and (iii) how a complaint may be made to the Board. Until such notice is given and acted upon, the Data Fiduciary may continue processing. This is the transitional notice obligation under Section 5(2).',
    section_reference: 'Section 5(2), Rule 3',
    category: 'notice',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'notice-003',
    title: 'Give the Data Principal the option to receive notice in scheduled languages',
    description:
      'The Data Fiduciary must give the Data Principal the option to access the notice in English or any language specified in the Eighth Schedule to the Constitution of India. This applies to both new notices under Section 5(1) and transitional notices under Section 5(2). It is not sufficient to provide the notice only in English if the Data Principal wishes to receive it in another scheduled language.',
    section_reference: 'Section 5(3)',
    category: 'notice',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },

  // ─── CONSENT - Phase 3 (13 May 2027) ────────────────────────────────────────
  {
    id: 'consent-001',
    title: 'Obtain free, specific, informed, unconditional and unambiguous consent',
    description:
      'Under Section 6(1), consent must be free, specific, informed, unconditional and unambiguous, given by a clear affirmative action. Consent must be limited to personal data necessary for the specified purpose. Every request for consent must be presented in clear and plain language and give the Data Principal the option to access it in English or any Eighth Schedule language. The request must also provide contact details of a DPO (where applicable) or other authorised person. Where consent is disputed in a proceeding, the burden of proving that notice was given and consent was obtained lies on the Data Fiduciary under Section 6(10).',
    section_reference: 'Section 6(1), Section 6(3), Section 6(10)',
    category: 'consent',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'consent-002',
    title: 'Enable withdrawal of consent with comparable ease',
    description:
      'Under Section 6(4), where consent is the basis of processing, the Data Principal has the right to withdraw consent at any time. The ease of withdrawing consent must be comparable to the ease with which it was given. The consequences of withdrawal are borne by the Data Principal under Section 6(5) - for example, the Data Fiduciary may stop providing a service - but withdrawal does not affect the legality of processing carried out before withdrawal.',
    section_reference: 'Section 6(4), Section 6(5)',
    category: 'consent',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'consent-003',
    title: 'Cease processing and cause Data Processors to cease upon consent withdrawal',
    description:
      'Under Section 6(6), when a Data Principal withdraws consent, the Data Fiduciary must within a reasonable time cease processing and cause its Data Processors to cease processing the personal data of that Data Principal - unless continued processing without consent is required or authorised under the Act, the Rules, or any other law in force in India. This requires a contractual mechanism with all Data Processors to implement withdrawal instructions.',
    section_reference: 'Section 6(6)',
    category: 'consent',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'consent-004',
    title: 'Identify and document legitimate use grounds where processing is without consent',
    description:
      'Under Section 7, a Data Fiduciary may process personal data without consent only for the legitimate uses listed: (a) voluntary provision of data for a specified purpose; (b) State functions including subsidies, benefits, licences and services; (c) performance of State functions under law or in the interest of sovereignty and integrity of India; (d) compliance with a legal disclosure obligation; (e) compliance with a court or tribunal order; (f) responding to a medical emergency; (g) provision of medical treatment during an epidemic or public health threat; (h) safety or assistance during a disaster or breakdown of public order; or (i) employment-related purposes. Processing outside these grounds without consent is unlawful.',
    section_reference: 'Section 7',
    category: 'consent',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },

  // ─── CHILDREN'S DATA - Phase 3 (13 May 2027) ────────────────────────────────
  {
    id: 'child-001',
    title: 'Obtain verifiable parental consent before processing personal data of a child',
    description:
      'Under Section 9(1), before processing any personal data of a child (under 18) or a person with disability who has a lawful guardian, the Data Fiduciary must obtain verifiable consent of the parent or lawful guardian. Rule 10 specifies the verification process: the Data Fiduciary must check that the individual identifying as the parent is an identifiable adult, by reference to reliable identity and age details already held, details voluntarily provided, or a virtual token issued by an authorised entity or Digital Locker service provider. Rule 11 governs verification for guardians of persons with disability.',
    section_reference: 'Section 9(1), Rule 10, Rule 11',
    category: 'data_fiduciary_duties',
    penalty_tier: 'critical',
    penalty_amount: 'Up to ₹200 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'child-002',
    title: 'Do not process children\'s data in a manner detrimental to their well-being, and do not track or target children',
    description:
      'Under Section 9(2), a Data Fiduciary must not process personal data of a child in any manner likely to cause detrimental effect on the well-being of the child. Under Section 9(3), a Data Fiduciary must not undertake tracking or behavioural monitoring of children or targeted advertising directed at children. These prohibitions apply regardless of whether parental consent has been obtained. Exemptions for specific classes of Data Fiduciaries (healthcare providers, educational institutions, crèches) and specific purposes are set out in Rule 12 and the Fourth Schedule.',
    section_reference: 'Section 9(2), Section 9(3), Rule 12, Fourth Schedule',
    category: 'data_fiduciary_duties',
    penalty_tier: 'critical',
    penalty_amount: 'Up to ₹200 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },

  // ─── DATA FIDUCIARY DUTIES - Phase 3 (13 May 2027) ──────────────────────────
  {
    id: 'df-001',
    title: 'Be responsible for compliance with the Act in respect of all processing, including by Data Processors',
    description:
      'Under Section 8(1), a Data Fiduciary is responsible for complying with the Act and Rules in respect of any processing undertaken by it or on its behalf by a Data Processor - irrespective of any agreement to the contrary or failure of a Data Principal to carry out their duties. This is the general accountability obligation. A breach by a Data Processor is attributed to the Data Fiduciary.',
    section_reference: 'Section 8(1)',
    category: 'data_fiduciary_duties',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'df-002',
    title: 'Engage Data Processors only under a valid contract',
    description:
      'Under Section 8(2), a Data Fiduciary may engage a Data Processor to process personal data on its behalf only under a valid contract. Rule 6(1)(f) requires that the contract include appropriate provisions requiring the Data Processor to take reasonable security safeguards. The Data Fiduciary remains responsible for the processor\'s compliance.',
    section_reference: 'Section 8(2), Rule 6(1)(f)',
    category: 'data_fiduciary_duties',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'df-003',
    title: 'Ensure completeness, accuracy and consistency of personal data used in decisions or shared with other Data Fiduciaries',
    description:
      'Under Section 8(3), where personal data processed by a Data Fiduciary is likely to be used to make a decision that affects the Data Principal, or disclosed to another Data Fiduciary, the Data Fiduciary must ensure its completeness, accuracy and consistency. This is the data quality obligation and applies particularly to credit, insurance, healthcare and employment contexts.',
    section_reference: 'Section 8(3)',
    category: 'data_fiduciary_duties',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'df-004',
    title: 'Implement appropriate technical and organisational measures to observe the Act',
    description:
      'Under Section 8(4), a Data Fiduciary must implement appropriate technical and organisational measures to ensure effective observance of the provisions of the Act and Rules. This is the general organisational compliance obligation - it requires policies, procedures, staff training, and governance structures, not just technical controls.',
    section_reference: 'Section 8(4)',
    category: 'data_fiduciary_duties',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'df-005',
    title: 'Implement reasonable security safeguards to prevent personal data breaches',
    description:
      'Under Section 8(5), a Data Fiduciary must protect personal data in its possession or under its control by taking reasonable security safeguards to prevent personal data breaches. Rule 6(1) specifies the minimum measures, which must include: (a) encryption, obfuscation, masking or virtual tokens; (b) access controls on computer resources; (c) logging and monitoring to detect unauthorised access; (d) data backups for continuity; (e) retention of logs and personal data for at least one year to enable investigation; (f) contractual provisions requiring processors to take equivalent safeguards; and (g) appropriate technical and organisational measures for effective observance of security safeguards.',
    section_reference: 'Section 8(5), Rule 6',
    category: 'data_fiduciary_duties',
    penalty_tier: 'critical',
    penalty_amount: 'Up to ₹250 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'df-006',
    title: 'Erase personal data when purpose is fulfilled or consent is withdrawn',
    description:
      'Under Section 8(7), a Data Fiduciary must erase personal data - and cause its Data Processors to erase it - upon the Data Principal withdrawing consent or as soon as it is reasonable to assume the specified purpose is no longer being served, whichever is earlier, unless retention is required by law. Under Section 8(8), the purpose is deemed no longer served if the Data Principal has not approached the Data Fiduciary for the performance of the specified purpose and has not exercised any rights in relation to such processing, for such time period as may be prescribed. Rule 8 specifies retention periods for specific classes (e-commerce entities with 2 crore+ users, online gaming intermediaries with 50 lakh+ users, and social media intermediaries with 2 crore+ users must erase after 3 years of inactivity). Rule 8(3) requires all Data Fiduciaries to retain personal data and processing logs for a minimum of one year from the date of processing.',
    section_reference: 'Section 8(7), Section 8(8), Rule 8',
    category: 'data_fiduciary_duties',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'df-007',
    title: 'Publish business contact information of DPO or authorised person',
    description:
      'Under Section 8(9), every Data Fiduciary must publish, in the prescribed manner, the business contact information of a Data Protection Officer (if applicable, i.e. if the organisation is an SDF) or a person who is able to answer questions raised by Data Principals about the processing of their personal data. Rule 9 requires this to be prominently published on the Data Fiduciary\'s website or app and mentioned in every response to a Data Principal\'s communication for exercise of their rights.',
    section_reference: 'Section 8(9), Rule 9',
    category: 'data_fiduciary_duties',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'df-008',
    title: 'Establish an effective grievance redressal mechanism',
    description:
      'Under Section 8(10), every Data Fiduciary must establish an effective mechanism to redress the grievances of Data Principals. Under Rule 14(3), the Data Fiduciary must prominently publish on its website or app the details of its grievance redressal system and must respond to grievances within a reasonable period not exceeding 90 days. Appropriate technical and organisational measures must be implemented to ensure effectiveness. The Data Principal must exhaust this mechanism before approaching the Board under Section 13(3).',
    section_reference: 'Section 8(10), Section 13, Rule 14(3)',
    category: 'data_fiduciary_duties',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },

  // ─── DATA PRINCIPAL RIGHTS - Phase 3 (13 May 2027) ──────────────────────────
  {
    id: 'rights-001',
    title: 'Respond to Data Principal requests for access to their personal data',
    description:
      'Under Section 11(1), a Data Principal has the right to obtain from the Data Fiduciary: (a) a summary of personal data being processed and the processing activities; (b) the identities of all other Data Fiduciaries and Data Processors with whom the data has been shared, along with a description of the data shared; and (c) any other prescribed information. Rule 14(1) and (2) require the Data Fiduciary to publish the means by which a Data Principal may make such a request. Note: the Act does not specify a fixed response deadline - the timeline is to be prescribed. The exemption in Section 11(2) applies to sharing with law enforcement entities authorised by law.',
    section_reference: 'Section 11, Rule 14',
    category: 'data_principal_rights',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'rights-002',
    title: 'Respond to Data Principal requests for correction, completion, updating and erasure',
    description:
      'Under Section 12, a Data Principal has the right to request correction of inaccurate or misleading personal data, completion of incomplete data, updating of data, and erasure of data. On receiving a correction or updating request under Section 12(2), the Data Fiduciary must correct, complete or update the data. On receiving an erasure request under Section 12(3), the Data Fiduciary must erase the data unless retention is necessary for the specified purpose or compliance with law. Rule 14(1) and (2) require the means for making such requests to be prominently published. Note: the Act does not specify a fixed response deadline - the timeline is to be prescribed.',
    section_reference: 'Section 12, Rule 14',
    category: 'data_principal_rights',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'rights-003',
    title: 'Enable Data Principals to nominate another individual to exercise their rights',
    description:
      'Under Section 14(1), a Data Principal has the right to nominate another individual who shall, in the event of the Data Principal\'s death or incapacity, exercise the Data Principal\'s rights under the Act. "Incapacity" means inability to exercise rights due to unsoundness of mind or infirmity of body under Section 14(2). Rule 14(4) requires the Data Fiduciary to enable nomination using the means and particulars it requires for exercise of this right, in accordance with its terms of service.',
    section_reference: 'Section 14, Rule 14(4)',
    category: 'data_principal_rights',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'rights-004',
    title: 'Publish the means by which Data Principals can exercise all rights under the Act',
    description:
      'Under Rule 14(1), every Data Fiduciary (and Consent Manager where applicable) must prominently publish on its website or app: (a) the details of the means using which a Data Principal may make a request for exercise of rights; and (b) the particulars required to identify the Data Principal under its terms of service (e.g. username, customer ID, application reference number, enrolment ID, email address, mobile number). This is a distinct publication obligation from the grievance mechanism and DPO contact details obligations.',
    section_reference: 'Rule 14(1)',
    category: 'data_principal_rights',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },

  // ─── BREACH NOTIFICATION - Phase 3 (13 May 2027) ────────────────────────────
  {
    id: 'breach-001',
    title: 'Notify affected Data Principals of a personal data breach without delay',
    description:
      'Under Section 8(6) and Rule 7(1), on becoming aware of a personal data breach, the Data Fiduciary must notify each affected Data Principal without delay, through their user account or any mode of communication registered with the Data Fiduciary. The notification must include: (a) a description of the breach including its nature, extent and timing; (b) the consequences likely to arise from the breach relevant to the Data Principal; (c) measures implemented or being implemented to mitigate risk; (d) safety measures the Data Principal may take to protect their interests; and (e) business contact information of a person able to respond to queries. There is no specific hour deadline for Data Principal notification - the standard is "without delay."',
    section_reference: 'Section 8(6), Rule 7(1)',
    category: 'breach_notification',
    penalty_tier: 'critical',
    penalty_amount: 'Up to ₹200 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },
  {
    id: 'breach-002',
    title: 'Notify the Data Protection Board of a breach: preliminary without delay, detailed within 72 hours',
    description:
      'Under Section 8(6) and Rule 7(2), on becoming aware of a personal data breach the Data Fiduciary must notify the Board in two stages. First, without delay: a description of the breach including its nature, extent, timing, location and likely impact. Second, within 72 hours of becoming aware (or such longer period as the Board allows on written request): (i) updated and detailed information on the breach; (ii) the broad facts regarding events, circumstances and causes; (iii) measures implemented or proposed to mitigate risk; (iv) any findings regarding the person who caused the breach; (v) remedial measures to prevent recurrence; and (vi) a report on the notifications given to affected Data Principals. The 72-hour clock runs from when the Data Fiduciary becomes aware of the breach.',
    section_reference: 'Section 8(6), Rule 7(2)',
    category: 'breach_notification',
    penalty_tier: 'critical',
    penalty_amount: 'Up to ₹200 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },

  // ─── CROSS-BORDER TRANSFER - Phase 3 (13 May 2027) ──────────────────────────
  {
    id: 'cbt-001',
    title: 'Comply with Central Government restrictions on cross-border transfer of personal data',
    description:
      'Under Section 16(1), the Central Government may by notification restrict the transfer of personal data by a Data Fiduciary for processing to such country or territory outside India as may be notified. Rule 15 provides that any transfer of personal data outside India must meet such requirements as the Central Government may specify by general or special order regarding making personal data available to any foreign State or to any person or entity under the control of or any agency of such a State. As of the date of these Rules, the Central Government has not yet issued a restriction notification or a requirements order - organisations should audit cross-border data flows and monitor MeitY notifications.',
    section_reference: 'Section 16(1), Rule 15',
    category: 'cross_border_transfer',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 3,
  },

  // ─── SDF-SPECIFIC - Phase 4 (On SDF gazette notification) ───────────────────
  {
    id: 'sdf-001',
    title: 'Appoint a Data Protection Officer based in India',
    description:
      'Under Section 10(2)(a), a Significant Data Fiduciary must appoint a Data Protection Officer who: (i) represents the SDF under the provisions of the Act; (ii) is based in India; (iii) is an individual responsible to the Board of Directors or similar governing body of the SDF; and (iv) is the point of contact for the grievance redressal mechanism under the Act. The DPO is the SDF\'s representative before the Data Protection Board. Note: Section 10(1) sets out the criteria for SDF designation (volume and sensitivity of data, risk to rights, sovereignty, electoral democracy, security of State, and public order) - the DPO obligation under Section 10(2)(a) applies only after the SDF is formally notified by the Central Government.',
    section_reference: 'Section 10(2)(a)',
    category: 'sdf_specific',
    penalty_tier: 'high',
    penalty_amount: 'Up to ₹150 crore',
    applies_to_sdf_only: true,
    phase: 4,
  },
  {
    id: 'sdf-002',
    title: 'Appoint an independent data auditor and conduct annual DPIA and audit',
    description:
      'Under Section 10(2)(b), an SDF must appoint an independent data auditor to evaluate compliance with the Act. Under Rule 13(1), the SDF must, once every 12 months from the date on which it was notified as an SDF, undertake a Data Protection Impact Assessment and an audit. Under Rule 13(2), the person carrying out the DPIA and audit must furnish a report of significant observations to the Board. The DPIA under Section 10(2)(c)(i) must include: a description of the rights of Data Principals and the purpose of processing; assessment and management of risk to Data Principal rights; and such other matters as may be prescribed.',
    section_reference: 'Section 10(2)(b), Section 10(2)(c)(i), Rule 13(1), Rule 13(2)',
    category: 'sdf_specific',
    penalty_tier: 'high',
    penalty_amount: 'Up to ₹150 crore',
    applies_to_sdf_only: true,
    phase: 4,
  },
  {
    id: 'sdf-003',
    title: 'Verify that algorithmic and technical measures do not pose a risk to the rights of Data Principals',
    description:
      'Under Rule 13(3), an SDF must observe due diligence to verify that technical measures including algorithmic software adopted by it for hosting, display, uploading, modification, publishing, transmission, storage, updating or sharing of personal data are not likely to pose a risk to the rights of Data Principals. This is not an algorithmic "impact assessment" as commonly understood - it is a due diligence obligation to verify that existing technical and algorithmic systems do not create risks. It must be done on an ongoing basis, not just at deployment.',
    section_reference: 'Section 10(2)(c)(iii), Rule 13(3)',
    category: 'sdf_specific',
    penalty_tier: 'high',
    penalty_amount: 'Up to ₹150 crore',
    applies_to_sdf_only: true,
    phase: 4,
  },
  {
    id: 'sdf-004',
    title: 'Ensure specified personal data is not transferred outside India (SDF data localisation)',
    description:
      'Under Rule 13(4), an SDF must take measures to ensure that personal data specified by the Central Government - on the basis of recommendations of a committee constituted by it, which includes officials from MeitY - is processed subject to the restriction that the personal data and the traffic data pertaining to its flow is not transferred outside the territory of India. This is a data localisation obligation that applies only to categories of data notified by the Government following committee recommendations. No such notification has been issued as of the date of the Rules.',
    section_reference: 'Rule 13(4)',
    category: 'sdf_specific',
    penalty_tier: 'high',
    penalty_amount: 'Up to ₹150 crore',
    applies_to_sdf_only: true,
    phase: 4,
  },

  // ─── CONSENT MANAGER - Phase 2 (13 November 2026) ───────────────────────────
  {
    id: 'cm-001',
    title: 'Register with the Board before acting as a Consent Manager',
    description:
      'Under Section 6(9), every Consent Manager must be registered with the Data Protection Board in the manner and subject to the technical, operational, financial and other conditions prescribed. Rule 4 governs registration. An applicant must satisfy the conditions in Part A of the First Schedule, which include: being a company incorporated in India; having sufficient technical, operational and financial capacity; a net worth of not less than ₹2 crore; sound management character; and independent certification that the interoperable platform is consistent with data protection standards published by the Board. The Board may suspend or cancel registration under Rule 4(5). This obligation applies only to entities seeking to act as a Consent Manager - most organisations will not need to register.',
    section_reference: 'Section 6(9), Rule 4, First Schedule Part A',
    category: 'consent_manager',
    penalty_tier: 'medium',
    penalty_amount: 'Up to ₹50 crore',
    applies_to_sdf_only: false,
    phase: 2,
  },
]

export const CATEGORY_LABELS: Record<string, string> = {
  notice: 'Notice',
  consent: 'Consent',
  data_principal_rights: 'Data Principal Rights',
  data_fiduciary_duties: 'Data Fiduciary Duties',
  sdf_specific: 'SDF-Specific',
  breach_notification: 'Breach Notification',
  cross_border_transfer: 'Cross-Border Transfer',
  consent_manager: 'Consent Manager',
}

export const PENALTY_COLORS: Record<string, string> = {
  critical: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  low: 'bg-green-50 text-green-700 border-green-200',
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-50 text-blue-700',
  done: 'bg-green-50 text-green-700',
  not_applicable: 'bg-gray-50 text-gray-400',
}

export const PHASE_LABELS: Record<number, string> = {
  2: 'Phase 2 - 13 November 2026',
  3: 'Phase 3 - 13 May 2027',
  4: 'Phase 4 - On SDF notification',
}
