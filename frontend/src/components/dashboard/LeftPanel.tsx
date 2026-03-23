'use client'
import { useMarketOverview } from '@/hooks/useMarketData'
import type { StockQuote } from '@/types'

const MOCK_INDICES = [
  { name: 'IHSG',    val: '7,384', chg: '+1.24%', up: true  },
  { name: 'LQ45',   val: '1,045', chg: '+0.87%', up: true  },
  { name: 'JII',    val: '584',   chg: '+0.65%', up: true  },
  { name: 'BISNIS', val: '1,521', chg: '-0.31%', up: false },
]

const MOCK_GAINERS: Partial<StockQuote>[] = [
  { ticker: 'PTBA', price: 2780, change_pct: 2.96 },
  { ticker: 'ADRO', price: 2340, change_pct: 2.41 },
  { ticker: 'ANTM', price: 1680, change_pct: 2.13 },
  { ticker: 'BBCA', price: 9250, change_pct: 1.93 },
  { ticker: 'BBRI', price: 5275, change_pct: 1.93 },
]

const MOCK_LOSERS: Partial<StockQuote>[] = [
  { ticker: 'GOTO', price: 68,   change_pct: -4.23 },
  { ticker: 'TLKM', price: 3790, change_pct: -1.56 },
  { ticker: 'SMGR', price: 5150, change_pct: -1.44 },
  { ticker: 'PGAS', price: 1605, change_pct: -1.23 },
  { ticker: 'ASII', price: 4820, change_pct: -0.62 },
]

interface LeftPanelProps {
  onTickerSelect: (ticker: string) => void
}

function StockRow({ s, onSelect }: { s: Partial<StockQuote>; onSelect: (t: string) => void }) {
  const up = (s.change_pct ?? 0) >= 0
  return (
    <div
      onClick={() => onSelect(s.ticker!)}
      className="flex items-center gap-2 py-1.5 border-b border-[#142035] cursor-pointer
                 hover:bg-[#162440] -mx-4 px-4 rounded transition-colors"
    >
      <span className="text-[13px] font-bold text-white min-w-[52px]"
            style={{ fontFamily: 'var(--font-mono)' }}>
        {s.ticker}
      </span>
      <span className="flex-1 text-[11px] text-[#3a5270]" />
      <span className="text-[12px] text-[#7a9bc4]" style={{ fontFamily: 'var(--font-mono)' }}>
        {s.price?.toLocaleString()}
      </span>
      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded min-w-[52px] text-right
                        ${up ? 'text-green bg-green/10' : 'text-red bg-red/10'}`}
            style={{ fontFamily: 'var(--font-mono)' }}>
        {up ? '+' : ''}{s.change_pct?.toFixed(2)}%
      </span>
    </div>
  )
}

export default function LeftPanel({ onTickerSelect }: LeftPanelProps) {
  return (
    <div className="w-[260px] min-w-[260px] bg-panel border-r border-[#142035] overflow-y-auto hidden lg:block">

      {/* Indices */}
      <div className="p-4 border-b border-[#142035]">
        <div className="section-title mb-3">Market Indices</div>
        <div className="grid grid-cols-2 gap-1.5">
          {MOCK_INDICES.map((idx) => (
            <div key={idx.name} className="bg-card border border-[#142035] rounded-md p-2 cursor-pointer hover:border-[#1e3550] transition-colors">
              <div className="text-[10px] text-[#3a5270] font-bold uppercase tracking-wider">{idx.name}</div>
              <div className="text-[16px] font-bold text-white mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{idx.val}</div>
              <div className={`text-[11px] font-bold ${idx.up ? 'text-green' : 'text-red'}`}
                   style={{ fontFamily: 'var(--font-mono)' }}>{idx.chg}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gainers */}
      <div className="p-4 border-b border-[#142035]">
        <div className="section-title mb-3">Top Gainers</div>
        {MOCK_GAINERS.map((s) => (
          <StockRow key={s.ticker} s={s} onSelect={onTickerSelect} />
        ))}
      </div>

      {/* Losers */}
      <div className="p-4">
        <div className="section-title mb-3">Top Losers</div>
        {MOCK_LOSERS.map((s) => (
          <StockRow key={s.ticker} s={s} onSelect={onTickerSelect} />
        ))}
      </div>

    </div>
  )
}
