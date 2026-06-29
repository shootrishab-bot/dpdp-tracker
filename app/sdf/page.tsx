'use client'

import { useState } from 'react'
import { useStore } from '@/lib/context'
import { Shield, ChevronRight, AlertCircle } from 'lucide-react'

// Questions map directly to the six factors in Section 10(1) of the DPDP Act 2023.
// SDF designation is made by the Central Government by notification - this assessment
// is a preliminary self-assessment tool only and does not constitute a formal determination.
const QUESTIONS = [
  {
    id: 'q1',
    factor: 'Section 10(1)(a)',
    text: 'Does your organisation process personal data of a large volume of Data Principals, or particularly sensitive categories of personal data?',
    hint: 'Section 10(1)(a) lists volume and sensitivity of personal data processed as the first SDF designation factor. The Central Government has not yet prescribed thresholds. Volume and sensitivity are assessed together - a smaller organisation processing highly sensitive data may still qualify.',
    sdfSignal: true,
  },
  {
    id: 'q2',
    factor: 'Section 10(1)(b)',
    text: 'Does the manner in which your organisation processes personal data pose a risk to the rights of Data Principals?',
    hint: 'Section 10(1)(b) asks about risk to the rights of Data Principals. This includes profiling, automated decision-making that affects individuals, or processing that creates power asymmetries between the organisation and the individuals whose data it processes.',
    sdfSignal: true,
  },
  {
    id: 'q3',
    factor: 'Section 10(1)(c)',
    text: 'Does your organisation\'s data processing have the potential to impact the sovereignty and integrity of India?',
    hint: 'Section 10(1)(c) covers potential impact on the sovereignty and integrity of India. This applies to entities processing data that could affect national infrastructure, government systems, or geopolitically sensitive information.',
    sdfSignal: true,
  },
  {
    id: 'q4',
    factor: 'Section 10(1)(d)',
    text: 'Does your organisation\'s data processing pose a risk to electoral democracy?',
    hint: 'Section 10(1)(d) specifically addresses risk to electoral democracy. This applies to platforms that could be used for disinformation, voter profiling, or influence operations - primarily large social media platforms, political data brokers, and electoral technology providers.',
    sdfSignal: true,
  },
  {
    id: 'q5',
    factor: 'Section 10(1)(e)',
    text: 'Does your organisation\'s data processing pose a risk to the security of the State?',
    hint: 'Section 10(1)(e) covers security of the State. This applies to defence contractors, intelligence-adjacent service providers, critical infrastructure operators (power, telecoms, finance), and entities whose data could be exploited to compromise national security.',
    sdfSignal: true,
  },
  {
    id: 'q6',
    factor: 'Section 10(1)(f)',
    text: 'Does your organisation\'s data processing pose a risk to public order?',
    hint: 'Section 10(1)(f) covers risk to public order. This applies to platforms at sufficient scale that their actions - such as content amplification, data-driven targeting, or processing failures - could destabilise public order. Large consumer platforms are the primary target.',
    sdfSignal: true,
  },
]

type Answer = 'yes' | 'no' | null

export default function SdfPage() {
  const { isSdf, setIsSdf } = useStore()
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [showResult, setShowResult] = useState(false)

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined && answers[q.id] !== null)
  const yesCount = QUESTIONS.filter(q => answers[q.id] === 'yes').length

  function handleSubmit() {
    // Indicating a likely SDF if any factor is answered yes - the Government considers
    // these factors together, and even one positive factor may be sufficient depending
    // on the weight the Government assigns to it.
    const result = yesCount >= 1
    setIsSdf(result)
    setShowResult(true)
  }

  function reset() {
    setAnswers({})
    setShowResult(false)
  }

  return (
    <div className="page" style={{ maxWidth: 740 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={16} color="var(--amber)" />
        </div>
        <h1 className="page-title" style={{ margin: 0 }}>SDF Self-Assessment</h1>
      </div>
      <p className="page-sub">Assess whether your organisation may be designated a Significant Data Fiduciary under Section 10 of the DPDP Act 2023</p>

      <div className="alert-amber" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <AlertCircle size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--amber-bright)', lineHeight: 1.7 }}>
            <strong>Important:</strong> SDF designation is made formally by the Central Government by notification under Section 10(1) - no organisation self-designates as an SDF. The six questions below correspond directly to the six factors listed in Section 10(1)(a)-(f) of the Act. This assessment helps determine whether your organisation should prepare for SDF-level obligations proactively and seek legal counsel on its likely designation status.
          </div>
        </div>
      </div>

      {showResult ? (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: yesCount >= 1 ? 'var(--amber-bg)' : 'var(--green-bg)', border: `1px solid ${yesCount >= 1 ? 'var(--amber-border)' : 'var(--green-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Shield size={28} color={yesCount >= 1 ? 'var(--amber)' : 'var(--green)'} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: yesCount >= 1 ? 'var(--amber-bright)' : '#6ee7b7', marginBottom: 8 }}>
            {yesCount >= 1 ? 'Potential SDF designation risk' : 'Low SDF designation risk'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 8px' }}>
            {yesCount >= 1
              ? `Your answers indicate that ${yesCount} of the 6 Section 10(1) factors may apply to your organisation. The Central Government considers these factors in making SDF designation decisions. You should obtain qualified legal advice on your designation risk and prepare for SDF-level obligations proactively.`
              : 'Your answers do not indicate any of the Section 10(1) factors apply to your organisation at this time. Standard Data Fiduciary obligations apply. Revisit this assessment if your scale or processing activities change.'}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.6 }}>
            This result has {yesCount >= 1 ? 'turned on' : 'turned off'} SDF obligations in your tracker. You can change this at any time in Settings.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-ghost" onClick={reset}>Retake assessment</button>
            <a href="/obligations" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              View obligations <ChevronRight size={14} />
            </a>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            Answer each question based on your organisation's current processing activities. Each question corresponds to one of the six statutory factors in Section 10(1).
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {QUESTIONS.map((q, i) => (
              <div key={q.id} className="card" style={{ padding: 20, borderColor: answers[q.id] ? 'var(--amber-border)' : 'var(--border)' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: answers[q.id] ? 'var(--amber-bg)' : 'var(--bg-elevated)', border: `1px solid ${answers[q.id] ? 'var(--amber-border)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: answers[q.id] ? 'var(--amber)' : 'var(--text-muted)' }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{q.factor}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.6 }}>{q.text}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>{q.hint}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['yes', 'no'] as const).map(val => (
                        <button
                          key={val}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                          style={{
                            padding: '6px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid',
                            background: answers[q.id] === val ? (val === 'yes' ? 'var(--amber-bg)' : 'var(--bg-elevated)') : 'var(--bg-elevated)',
                            color: answers[q.id] === val ? (val === 'yes' ? 'var(--amber-bright)' : 'var(--text-primary)') : 'var(--text-muted)',
                            borderColor: answers[q.id] === val ? (val === 'yes' ? 'var(--amber)' : 'var(--border-bright)') : 'var(--border)',
                          }}
                        >
                          {val === 'yes' ? 'Yes' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {Object.values(answers).filter(Boolean).length} of {QUESTIONS.length} answered
            </span>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!allAnswered}
              style={{ opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              View result <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
