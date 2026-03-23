'use client'
// ===== BROKER FLOW FULL PAGE =====

const BROKERS = [
  { b: 'BK', net: 42.5 }, { b: 'YP', net: 38.2 }, { b: 'ZP', net: 28.7 },
  { b: 'AK', net: 25.1 }, { b: 'MU', net: 19.8 },
  { b: 'CS', net: -31.2},{ b: 'DX', net: -27.4},{ b: 'GR', net: -22.1},
  { b: 'KZ', net: -18.9},{ b: 'HD', net: -15.3},
]

const TICKERS = ['BBCA','TLKM','BBRI','ASII','BMRI']
const maxNet = Math.max(...BROKERS.map(b => Math.abs(b.net)))

export default function BrokerFlowPage() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Broker Flow Analytics</h1>
      <p className="text-[13px] text-[#3a5270] mb-6">Real-time institutional transaction flow analysis</p>

      {/* Ticker selector */}
      <div className="flex gap-2 mb-6">
        {TICKERS.map(t => (
          <button key={t} className="filter-chip active">{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Accumulation */}
        <div className="bg-panel border border-[#142035] rounded-lg p-5">
          <div className="text-[10px] text-green font-bold uppercase tracking-wider mb-4">
            Top Accumulation (Buy)
          </div>
          {BROKERS.filter(b => b.net > 0).map(b => (
            <div key={b.b} className="flex items-center gap-3 mb-2.5">
              <span className="text-[12px] font-bold text-white min-w-[24px]"
                    style={{ fontFamily: 'var(--font-mono)' }}>{b.b}</span>
              <div className="flex-1 h-1.5 bg-elevated rounded overflow-hidden">
                <div className="h-full bg-green rounded transition-all duration-500"
                     style={{ width: `${(b.net / maxNet) * 100}%` }} />
              </div>
              <span className="text-[12px] text-green min-w-[48px] text-right"
                    style={{ fontFamily: 'var(--font-mono)' }}>+{b.net.toFixed(1)}B</span>
            </div>
          ))}
        </div>

        {/* Distribution */}
        <div className="bg-panel border border-[#142035] rounded-lg p-5">
          <div className="text-[10px] text-red font-bold uppercase tracking-wider mb-4">
            Top Distribution (Sell)
          </div>
          {BROKERS.filter(b => b.net < 0).map(b => (
            <div key={b.b} className="flex items-center gap-3 mb-2.5">
              <span className="text-[12px] font-bold text-white min-w-[24px]"
                    style={{ fontFamily: 'var(--font-mono)' }}>{b.b}</span>
              <div className="flex-1 h-1.5 bg-elevated rounded overflow-hidden">
                <div className="h-full bg-red rounded transition-all duration-500"
                     style={{ width: `${(Math.abs(b.net) / maxNet) * 100}%` }} />
              </div>
              <span className="text-[12px] text-red min-w-[48px] text-right"
                    style={{ fontFamily: 'var(--font-mono)' }}>{b.net.toFixed(1)}B</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full net flow */}
      <div className="bg-panel border border-[#142035] rounded-lg p-5">
        <div className="section-title mb-4">All Broker Net Flow — BBCA</div>
        {BROKERS.map(b => (
          <div key={b.b} className="flex items-center gap-3 mb-2">
            <span className="text-[12px] font-bold text-white min-w-[24px]"
                  style={{ fontFamily: 'var(--font-mono)' }}>{b.b}</span>
            <div className="flex-1 h-1.5 bg-elevated rounded overflow-hidden">
              <div className={`h-full rounded transition-all duration-500 ${b.net > 0 ? 'bg-green' : 'bg-red'}`}
                   style={{ width: `${(Math.abs(b.net) / maxNet) * 100}%` }} />
            </div>
            <span className={`text-[12px] font-bold min-w-[52px] text-right ${b.net > 0 ? 'text-green' : 'text-red'}`}
                  style={{ fontFamily: 'var(--font-mono)' }}>
              {b.net > 0 ? '+' : ''}{b.net.toFixed(1)}B
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
