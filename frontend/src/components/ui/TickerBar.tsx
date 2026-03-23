'use client'
import { usePriceStore } from '@/store'

const DEFAULT_TICKERS = [
  { sym: 'BBCA', price: 9250, pct: 1.93 },
  { sym: 'TLKM', price: 3790, pct: -1.56 },
  { sym: 'BBRI', price: 5275, pct: 1.93 },
  { sym: 'ASII', price: 4820, pct: -0.62 },
  { sym: 'BMRI', price: 7100, pct: 1.79 },
  { sym: 'GOTO', price: 68,   pct: -4.23 },
  { sym: 'ADRO', price: 2340, pct: 2.41 },
  { sym: 'ANTM', price: 1680, pct: 2.13 },
  { sym: 'PTBA', price: 2780, pct: 2.96 },
  { sym: 'KLBF', price: 1625, pct: 1.56 },
]

interface TickerBarProps {
  onTickerClick?: (ticker: string) => void
}

export default function TickerBar({ onTickerClick }: TickerBarProps) {
  const prices = usePriceStore((s) => s.prices)

  const items = [...DEFAULT_TICKERS, ...DEFAULT_TICKERS].map((t, i) => {
    const live = prices[t.sym]
    const pct  = live ? live.change_pct : t.pct
    const price = live ? live.price : t.price
    const up = pct >= 0
    return (
      <div
        key={`${t.sym}-${i}`}
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => onTickerClick?.(t.sym)}
      >
        <span className="text-[12px] font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
          {t.sym}
        </span>
        <span className="text-[12px] text-[#7a9bc4]" style={{ fontFamily: 'var(--font-mono)' }}>
          {price.toLocaleString()}
        </span>
        <span
          className={`text-[11px] font-bold ${up ? 'text-green' : 'text-red'}`}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {up ? '+' : ''}{pct.toFixed(2)}%
        </span>
      </div>
    )
  })

  return (
    <div className="h-8 bg-deep border-b border-[#142035] overflow-hidden flex items-center">
      <div className="flex gap-10 whitespace-nowrap px-5 animate-ticker">
        {items}
      </div>
    </div>
  )
}
