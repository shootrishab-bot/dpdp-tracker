import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-brand',
})
import { StoreProvider } from '@/lib/context'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

export const metadata: Metadata = {
  title: 'Trackr - DPDP Compliance Tracker',
  description: 'Track phased compliance obligations under the Digital Personal Data Protection Act 2023 and Rules 2025',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <StoreProvider>
          {/* Mobile top bar */}
          <div className="mobile-header">
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#0d1117"/>
                <path d="M16 3L5 7.5V15.5C5 21.8 9.8 27.6 16 29C22.2 27.6 27 21.8 27 15.5V7.5L16 3Z"
                  fill="#111420" stroke="#3b5bdb" strokeWidth="1.4"/>
                <path d="M11.5 9.5H20.5L16.6 14.4H15.4L11.5 9.5Z" fill="#0ea5e9"/>
                <path d="M11.5 22.5H20.5L16.6 17.6H15.4L11.5 22.5Z" fill="#38bdf8" fillOpacity="0.75"/>
                <rect x="11" y="8.5" width="10" height="1.2" rx="0.6" fill="#748ffc"/>
                <rect x="11" y="22.3" width="10" height="1.2" rx="0.6" fill="#748ffc"/>
                <circle cx="16" cy="16" r="1.1" fill="#38bdf8"/>
              </svg>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-brand)' }}>Trackr</div>
                
              </div>
            </a>
          </div>

          <div className="app-layout">
            <Sidebar />
            <main className="app-main">
              {children}
            </main>
          </div>

          {/* Mobile bottom nav */}
          <MobileNav />
        </StoreProvider>
      </body>
    </html>
  )
}
