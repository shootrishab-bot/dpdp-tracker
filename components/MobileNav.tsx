'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ListChecks, Timer, ShieldAlert, Settings } from 'lucide-react'

const mobileNav = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/obligations', label: 'Obligations', icon: ListChecks },
  { href: '/commencement', label: 'Timers', icon: Timer },
  { href: '/risk', label: 'Risk', icon: ShieldAlert },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="mobile-nav">
      {mobileNav.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
          <Icon size={18} />
          {label}
        </Link>
      ))}
    </nav>
  )
}
