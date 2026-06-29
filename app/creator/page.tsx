
import { ExternalLink, Mail, BookOpen, Code2, Award, GraduationCap } from 'lucide-react'

export default function CreatorPage() {
  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Built by</p>
        <h1 className="page-title">Rishab Ramakrishna</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Fresh graduate in BBA LLB (Hons.) from Jindal Global Law School, specialising in Technology Law, Data Privacy and Commercial Contracts. Also a self-taught builder of legal tech tools.
        </p>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14 }}>
          I built Trackr and Deviate because I wanted to understand legal tech from the inside out, not just write about it. Both apps were built from scratch using VS Code, Cursor, and Claude - without a formal engineering background. The process gave me a practical lens on the intersection of law and technology that coursework alone could not have provided.
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Trackr tracks phased DPDP Act 2023 compliance obligations, breach notification timelines, rights requests, and SDF designation risk. Deviate is an AI-powered contract risk assessment tool for commercial negotiations. Both are live and free to use.
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Code2 size={14} color="var(--teal)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Legal Tech Products</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Trackr</span>
              <span className="badge badge-teal">This app</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              DPDP Act 2023 compliance tracker with phased commencement timers, breach notification logs, rights request tracking, and SDF assessment. Built for law firms tracking multiple clients.
            </p>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Deviate</span>
              <a href="https://deviate-contracts-five.vercel.app/" target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--teal)', textDecoration: 'none' }}>
                Visit <ExternalLink size={10} />
              </a>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              AI-powered contract risk assessment tool for commercial negotiations. Batch analysis, configurable playbook, clause-level risk flagging, and Word export.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <BookOpen size={14} color="var(--teal)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Research and Publications</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              title: 'Beyond Privacy: Framing Coercive Data Collection as Antitrust Harm in CCI v. Meta Platforms',
              venue: 'Indian Journal of Law and Legal Research (IJLLR)',
              href: 'https://www.ijllr.com/post/beyond-privacy-framing-coercive-data-collection-as-antitrust-harm-in-cci-v-meta-platforms',
            },
            {
              title: 'Virtual Asset Regulation Report - Digital Asset Classification Under the FIT21 Act',
              venue: 'PYOR - distributed to industry stakeholders and high value investors',
              href: 'https://assets.pyor.xyz/publications/classification-of-digital-assets.pdf',
            },
          ].map(p => (
            <div key={p.title} className="card" style={{ padding: 16 }}>
              <a href={p.href} target="_blank" rel="noreferrer"
                style={{ fontSize: 13, fontWeight: 500, color: 'var(--teal)', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                <ExternalLink size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                {p.title}
              </a>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 18 }}>{p.venue}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Award size={14} color="var(--teal)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Fellowship and Training</span>
        </div>
        <div className="card" style={{ padding: 18, marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>International Technology Law Research Fellowship</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>2nd South Asian Technology Law Conclave (SATLC), 2026 - Centre for Development of Intellectual Property and Research (CDIPR)</p>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 10 }}>Specialised courses</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              'Regulation of Artificial Intelligence',
              'Data Platforms and Competition Law',
              'EU Data Protection Frameworks in Asia',
              'Fintech Law Fundamentals (Falcon Legal)',
              'Law, Technology and Society in the Digital Age',
            ].map(c => <span key={c} className="badge badge-na" style={{ fontSize: 10 }}>{c}</span>)}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <GraduationCap size={14} color="var(--teal)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Education</span>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>B.B.A. LL.B. (Hons.)</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Jindal Global Law School (JGLS) - Aug 2021 to Jun 2026 - CGPA 7/8</p>
        </div>
      </div>

      <div className="card" style={{ padding: 20, background: 'var(--teal-bg)', borderColor: 'var(--teal-border)' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal-bright)', marginBottom: 14 }}>Get in touch</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {[
            { icon: Mail, label: 'rishabrsid@gmail.com', href: 'mailto:rishabrsid@gmail.com' },            { icon: ExternalLink, label: "LinkedIn", href: "https://linkedin.com/in/rishab-ramakrishna-ab3b46228" },
          ].map(({ icon: Icon, label, href }) => (
            <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--teal-bright)', textDecoration: 'none' }}>
              <Icon size={13} />{label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
