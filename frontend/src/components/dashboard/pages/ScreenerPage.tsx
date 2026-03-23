'use client'
import { useState } from 'react'
import { Search, Filter, TrendingUp, Zap } from 'lucide-react'

const SIGNALS = ['Breakout', 'Unusual Volume', 'High Momentum', 'Foreign Accumulation', 'RSI Oversold', 'MACD Bullish', 'Golden Cross', 'Fib Support']

const MOCK_RESULTS = [
  { sym: 'PTBA', name: 'Bukit Asam',          price: 2780, pct: 2.96,  vol: 65.1,  rsi: 68, signals: ['Breakout','High Momentum'],          score: 87 },
  { sym: 'ADRO', name: 'Adaro Energy',         price: 2340, pct: 2.41,  vol: 78.4,  rsi: 64, signals: ['Breakout','Unusual Volume'],           score: 83 },
  { sym: 'ANTM', name: 'Aneka Tambang',        price: 1680, pct: 2.13,  vol: 110.3, rsi: 63, signals: ['Foreign Accumulation','High Momentum'],score: 79 },
  { sym: 'BBCA', name: 'Bank Central Asia',    price: 9250, pct: 1.93,  vol: 85.2,  rsi: 62, signals: ['Golden Cross','High Momentum'],        score: 76 },
  { sym: 'BBRI', name: 'Bank Rakyat Indonesia',price: 5275, pct: 1.93,  vol: 200.7, rsi: 58, signals: ['Unusual Volume','MACD Bullish'],        score: 72 },
  { sym: 'BMRI', name: 'Bank Mandiri',         price: 7100, pct: 1.79,  vol: 67.8,  rsi: 55, signals: ['MACD Bullish'],                        score: 61 },
  { sym: 'KLBF', name: 'Kalbe Farma',          price: 1625, pct: 1.56,  vol: 41.2,  rsi: 60, signals: ['Fib Support','High Momentum'],          score: 58 },
  { sym: 'GOTO', name: 'GoTo Gojek Tokopedia', price: 68,   pct: -4.23, vol: 890.5, rsi: 32, signals: ['RSI Oversold'],                        score: 45 },
  { sym: 'TLKM', name: 'Telekomunikasi',       price: 3790, pct: -1.56, vol: 120.4, rsi: 38, signals: ['RSI Oversold','Unusual Volume'],        score: 42 },
]

const TAG_COLORS: Record<string, string> = {
  'Breakout':             'text-green bg-green/10 border-green/20',
  'Unusual Volume':       'text-blue  bg-blue/10  border-blue/20',
  'High Momentum':        'text-purple bg-purple/10 border-purple/20',
  'Foreign Accumulation': 'text-amber  bg-amber/10  border-amber/20',
  'RSI Oversold':         'text-red    bg-red/10    border-red/20',
  'MACD Bullish':         'text-green  bg-green/10  border-green/20',
  'Golden Cross':         'text-green  bg-green/10  border-green/20',
  'Fib Support':          'text-blue   bg-blue/10   border-blue/20',
}

interface ScreenerPageProps {
  onTickerSelect: (t: string) => void
}

export default function ScreenerPage({ onTickerSelect }: ScreenerPageProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>(['Breakout'])
  const [minChange, setMinChange] = useState(1)
  const [minVol, setMinVol] = useState(20)

  const toggleFilter = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  const filtered = MOCK_RESULTS.filter(s => {
    if (activeFilters.length === 0) return true
    return activeFilters.some(f => s.signals.includes(f))
  })

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Smart Stock Screener</h1>
      <p className="text-[13px] text-[#3a5270] mb-6">Filter and discover high-potential opportunities across IDX</p>

      {/* Filters */}
      <div className="bg-panel border border-[#142035] rounded-lg p-5 mb-5">
        <div className="section-title mb-4">Signal Filters</div>
        <div className="flex flex-wrap gap-2 mb-5">
          {SIGNALS.map((s) => (
            <button
              key={s}
              onClick={() => toggleFilter(s)}
              className={`filter-chip ${activeFilters.includes(s) ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2 text-[12px] text-[#7a9bc4]">
            Min Change
            <input type="number" value={minChange} onChange={e => setMinChange(+e.target.value)}
                   className="trading-input w-16" />
            %
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#7a9bc4]">
            Min Volume
            <input type="number" value={minVol} onChange={e => setMinVol(+e.target.value)}
                   className="trading-input w-16" />
            M
          </div>
          <button className="btn-primary ml-auto flex items-center gap-2">
            <Search size={14} /> Run Screener
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-panel border border-[#142035] rounded-lg overflow-auto">
        <div className="p-4 border-b border-[#142035] flex items-center gap-3">
          <div className="section-title flex-1">Results</div>
          <span className="text-[12px] text-[#7a9bc4]">{filtered.length} stocks found</span>
        </div>
        <table className="trading-table">
          <thead>
            <tr>
              <th>Ticker</th><th>Name</th><th>Price</th>
              <th>Change</th><th>Volume</th><th>RSI</th><th>Signals</th><th>Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const up = s.pct >= 0
              const scoreColor = s.score > 70 ? 'text-green' : s.score > 45 ? 'text-amber' : 'text-red'
              return (
                <tr key={s.sym} className="cursor-pointer" onClick={() => onTickerSelect(s.sym)}>
                  <td className="text-green font-bold">{s.sym}</td>
                  <td className="text-[#7a9bc4] text-[11px]">{s.name}</td>
                  <td className="text-white">{s.price.toLocaleString()}</td>
                  <td className={up ? 'text-green' : 'text-red'}>{up?'+':''}{s.pct.toFixed(2)}%</td>
                  <td className="text-[#7a9bc4]">{s.vol.toFixed(1)}M</td>
                  <td className={s.rsi > 60 ? 'text-green' : s.rsi < 40 ? 'text-red' : 'text-amber'}>{s.rsi}</td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {s.signals.map(sig => (
                        <span key={sig} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border
                                                    ${TAG_COLORS[sig] || 'text-[#7a9bc4]'}`}>
                          {sig}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-elevated rounded overflow-hidden">
                        <div className={`h-full rounded ${s.score>70?'bg-green':s.score>45?'bg-amber':'bg-red'}`}
                             style={{ width: `${s.score}%` }} />
                      </div>
                      <span className={`text-[11px] font-bold ${scoreColor}`}>{s.score}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
