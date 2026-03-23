'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import type { NavTab } from '@/app/page'

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'markets',    label: 'Markets' },
  { id: 'screener',   label: 'Screener' },
  { id: 'brokerflow', label: 'Broker Flow' },
  { id: 'ai',         label: 'AI Insights' },
  { id: 'watchlist',  label: 'Watchlist' },
]

interface NavbarProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      setSearch('')
    }
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center h-[54px] px-5 gap-0
                    bg-void/95 border-b border-[#142035] backdrop-blur-xl">
      {/* Logo */}
      <div className="mr-8 text-[18px] font-bold tracking-wide text-green text-glow-green whitespace-nowrap">
        PASYA <span className="text-white">STOCK</span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`px-4 h-[54px] text-[13px] font-semibold tracking-wider uppercase
                        border-b-2 transition-all duration-150 cursor-pointer
                        ${activeTab === item.id
                          ? 'text-green border-green'
                          : 'text-[#7a9bc4] border-transparent hover:text-white'
                        }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2 bg-panel border border-[#142035]
                        rounded-md px-3 h-8 min-w-[180px]">
          <Search size={12} className="text-[#3a5270]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
            onKeyPress={handleSearch}
            placeholder="Search ticker..."
            className="bg-transparent border-none outline-none text-white text-[13px] w-[130px]
                       placeholder:text-[#3a5270]"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-green font-semibold">
          <span className="live-dot" />
          LIVE
        </div>
      </div>
    </nav>
  )
}
