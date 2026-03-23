'use client'
import { useState } from 'react'
import { Plus, X, Star, Bell } from 'lucide-react'
import { useWatchlistStore } from '@/store'

const MOCK_DATA: Record<string, { name: string; price: number; pct: number; vol: number; rsi: number }> = {
  BBCA: { name: 'Bank Central Asia',      price: 9250, pct:  1.93, vol: 85.2,  rsi: 62 },
  TLKM: { name: 'Telekomunikasi',         price: 3790, pct: -1.56, vol: 120.4, rsi: 38 },
  BBRI: { name: 'Bank Rakyat Indonesia',  price: 5275, pct:  1.93, vol: 200.7, rsi: 58 },
  BMRI: { name: 'Bank Mandiri',           price: 7100, pct:  1.79, vol: 67.8,  rsi: 55 },
  ADRO: { name: 'Adaro Energy',           price: 2340, pct:  2.41, vol: 78.4,  rsi: 64 },
  ANTM: { name: 'Aneka Tambang',          price: 1680, pct:  2.13, vol: 110.3, rsi: 63 },
  GOTO: { name: 'GoTo Gojek Tokopedia',   price: 68,   pct: -4.23, vol: 890.5, rsi: 32 },
  PTBA: { name: 'Bukit Asam',             price: 2780, pct:  2.96, vol: 65.1,  rsi: 68 },
}

interface WatchlistPageProps {
  onTickerSelect: (ticker: string) => void
}

export default function WatchlistPage({ onTickerSelect }: WatchlistPageProps) {
  const { tickers, add, remove } = useWatchlistStore()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const t = input.trim().toUpperCase()
    if (t) { add(t); setInput('') }
  }

  return (
    <div className="p-6 max-w-[800px] mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <Star size={20} className="text-amber" />
        <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
      </div>
      <p className="text-[13px] text-[#3a5270] mb-6">Track your favorite stocks in real-time</p>

      {/* Add stock */}
      <div className="flex gap-3 mb-6">
        <input
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyPress={e => e.key === 'Enter' && handleAdd()}
          placeholder="Enter ticker symbol (e.g. BBRI)"
          className="trading-input flex-1 text-sm"
        />
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Add Stock
        </button>
      </div>

      {/* Watchlist items */}
      {tickers.length === 0 ? (
        <div className="text-center py-12 text-[#3a5270]">
          <Star size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-[14px]">No stocks in watchlist. Add your first stock above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickers.map((ticker) => {
            const d = MOCK_DATA[ticker]
            const up = d ? d.pct >= 0 : true

            return (
              <div
                key={ticker}
                className="bg-panel border border-[#142035] rounded-xl p-4
                           hover:border-[#1e3550] transition-colors cursor-pointer"
                onClick={() => onTickerSelect(ticker)}
              >
                <div className="flex items-center gap-4">
                  {/* Symbol */}
                  <div className="min-w-[80px]">
                    <div className="text-[18px] font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                      {ticker}
                    </div>
                    <div className="text-[11px] text-[#3a5270] truncate max-w-[120px]">
                      {d?.name ?? ticker}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-1">
                    <div className="text-[20px] font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                      {d?.price.toLocaleString() ?? '—'}
                    </div>
                    <div className={`text-[13px] font-bold ${up ? 'text-green' : 'text-red'}`}
                         style={{ fontFamily: 'var(--font-mono)' }}>
                      {d ? `${up?'+':''}${d.pct.toFixed(2)}%` : '—'}
                    </div>
                  </div>

                  {/* Volume */}
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-[#3a5270] uppercase tracking-wider">Volume</div>
                    <div className="text-[14px] text-[#7a9bc4]" style={{ fontFamily: 'var(--font-mono)' }}>
                      {d?.vol.toFixed(1) ?? '—'}M
                    </div>
                  </div>

                  {/* RSI */}
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-[#3a5270] uppercase tracking-wider">RSI</div>
                    <div className={`text-[14px] font-bold ${
                      (d?.rsi ?? 50) > 60 ? 'text-green' :
                      (d?.rsi ?? 50) < 40 ? 'text-red' : 'text-amber'
                    }`} style={{ fontFamily: 'var(--font-mono)' }}>
                      {d?.rsi ?? '—'}
                    </div>
                  </div>

                  {/* Alert + Remove */}
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      className="text-[#3a5270] hover:text-amber transition-colors p-1"
                      onClick={e => { e.stopPropagation() }}
                      title="Set alert"
                    >
                      <Bell size={14} />
                    </button>
                    <button
                      className="text-[#3a5270] hover:text-red transition-colors p-1"
                      onClick={e => { e.stopPropagation(); remove(ticker) }}
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
