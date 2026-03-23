'use client'
import { useWatchlistStore } from '@/store'
import { Star, StarOff, TrendingUp, TrendingDown } from 'lucide-react'

const MOCK_VOL_LEADERS = [
  { sym: 'GOTO', vol: 890.5 },
  { sym: 'BBRI', vol: 200.7 },
  { sym: 'TLKM', vol: 120.4 },
  { sym: 'BBCA', vol: 85.2  },
  { sym: 'ADRO', vol: 78.4  },
  { sym: 'ASII', vol: 67.8  },
]

const MOCK_ACTIVE = [
  { sym: 'GOTO', name: 'GoTo Gojek', price: 68,   pct: -4.23 },
  { sym: 'BBRI', name: 'Bank Rakyat', price: 5275, pct: 1.93  },
  { sym: 'TLKM', name: 'Telkom',      price: 3790, pct: -1.56 },
  { sym: 'BBCA', name: 'BCA',         price: 9250, pct: 1.93  },
  { sym: 'ADRO', name: 'Adaro Energy',price: 2340, pct: 2.41  },
]

const AI_SIGNALS = [
  { sym: 'BBCA', signal: 'BULLISH', text: 'Golden cross detected' },
  { sym: 'ADRO', signal: 'BULLISH', text: 'High volume breakout' },
  { sym: 'GOTO', signal: 'BEARISH', text: 'Breaking key support' },
]

const WL_STOCKS = [
  { sym: 'BBCA', price: 9250, pct: 1.93  },
  { sym: 'TLKM', price: 3790, pct: -1.56 },
  { sym: 'BBRI', price: 5275, pct: 1.93  },
  { sym: 'BMRI', price: 7100, pct: 1.79  },
]

interface RightPanelProps {
  onTickerSelect: (ticker: string) => void
}

export default function RightPanel({ onTickerSelect }: RightPanelProps) {
  const maxVol = MOCK_VOL_LEADERS[0].vol

  return (
    <div className="w-[260px] min-w-[260px] bg-panel border-l border-[#142035] overflow-y-auto hidden xl:block">

      {/* Volume Leaders */}
      <div className="p-4 border-b border-[#142035]">
        <div className="section-title mb-3">Volume Leaders</div>
        {MOCK_VOL_LEADERS.map((s) => (
          <div key={s.sym} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => onTickerSelect(s.sym)}>
            <span className="text-[12px] font-bold text-white min-w-[40px]"
                  style={{ fontFamily: 'var(--font-mono)' }}>{s.sym}</span>
            <div className="flex-1 h-[5px] bg-elevated rounded overflow-hidden">
              <div className="h-full bg-blue rounded transition-all duration-500"
                   style={{ width: `${(s.vol / maxVol) * 100}%` }} />
            </div>
            <span className="text-[11px] text-[#3a5270] min-w-[38px] text-right"
                  style={{ fontFamily: 'var(--font-mono)' }}>
              {s.vol.toFixed(0)}M
            </span>
          </div>
        ))}
      </div>

      {/* Most Active */}
      <div className="p-4 border-b border-[#142035]">
        <div className="section-title mb-3">Most Active</div>
        {MOCK_ACTIVE.map((s) => {
          const up = s.pct >= 0
          return (
            <div key={s.sym}
                 onClick={() => onTickerSelect(s.sym)}
                 className="flex items-center gap-2 py-1.5 border-b border-[#142035] cursor-pointer
                            hover:bg-[#162440] -mx-4 px-4 transition-colors">
              <span className="text-[13px] font-bold text-white min-w-[44px]"
                    style={{ fontFamily: 'var(--font-mono)' }}>{s.sym}</span>
              <span className="text-[11px] text-[#3a5270] flex-1 truncate">{s.name}</span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded
                                ${up ? 'text-green bg-green/10' : 'text-red bg-red/10'}`}
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {up ? '+' : ''}{s.pct.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* AI Signals */}
      <div className="p-4 border-b border-[#142035]">
        <div className="section-title mb-3">AI Signals</div>
        {AI_SIGNALS.map((s) => {
          const bull = s.signal === 'BULLISH'
          return (
            <div key={s.sym} className="py-2 border-b border-[#142035]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-bold text-white"
                      style={{ fontFamily: 'var(--font-mono)' }}>{s.sym}</span>
                <span className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded uppercase
                                  ${bull ? 'text-green bg-green/10 border border-green/20'
                                         : 'text-red bg-red/10 border border-red/20'}`}>
                  {s.signal}
                </span>
                {bull ? <TrendingUp size={12} className="ml-auto text-green" />
                      : <TrendingDown size={12} className="ml-auto text-red" />}
              </div>
              <div className="text-[11px] text-[#7a9bc4]">{s.text}</div>
            </div>
          )
        })}
      </div>

      {/* Quick Watchlist */}
      <div className="p-4">
        <div className="section-title mb-3">Watchlist</div>
        {WL_STOCKS.map((s) => {
          const up = s.pct >= 0
          return (
            <div key={s.sym}
                 onClick={() => onTickerSelect(s.sym)}
                 className="flex items-center gap-2 py-1.5 border-b border-[#142035] cursor-pointer
                            hover:bg-[#162440] -mx-4 px-4 transition-colors">
              <span className="text-[13px] font-bold text-white min-w-[44px]"
                    style={{ fontFamily: 'var(--font-mono)' }}>{s.sym}</span>
              <span className="flex-1 text-[12px] text-[#7a9bc4]"
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {s.price.toLocaleString()}
              </span>
              <span className={`text-[11px] font-bold ${up ? 'text-green' : 'text-red'}`}
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {up ? '+' : ''}{s.pct.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>

    </div>
  )
}
