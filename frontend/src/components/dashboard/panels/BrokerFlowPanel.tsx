'use client'
import { useBrokerFlow } from '@/hooks/useMarketData'

interface BrokerFlowPanelProps { ticker: string }

const MOCK_FLOWS = [
  { broker: 'BK', net: 42.5, type: 'buy'  as const },
  { broker: 'YP', net: 38.2, type: 'buy'  as const },
  { broker: 'ZP', net: 28.7, type: 'buy'  as const },
  { broker: 'AK', net: 25.1, type: 'buy'  as const },
  { broker: 'MU', net: 19.8, type: 'buy'  as const },
  { broker: 'CS', net: -31.2,type: 'sell' as const },
  { broker: 'DX', net: -27.4,type: 'sell' as const },
  { broker: 'GR', net: -22.1,type: 'sell' as const },
  { broker: 'KZ', net: -18.9,type: 'sell' as const },
  { broker: 'HD', net: -15.3,type: 'sell' as const },
]

export default function BrokerFlowPanel({ ticker }: BrokerFlowPanelProps) {
  const maxNet = Math.max(...MOCK_FLOWS.map((f) => Math.abs(f.net)))

  return (
    <div className="p-4">
      <div className="text-[10px] text-[#3a5270] font-bold uppercase tracking-wider mb-3">
        {ticker} — Net Broker Flow
      </div>
      <div className="grid grid-cols-2 gap-x-6">
        <div>
          <div className="text-[10px] text-green font-bold uppercase tracking-wider mb-2">Top Accumulation</div>
          {MOCK_FLOWS.filter(f => f.type === 'buy').map((f) => (
            <div key={f.broker} className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] font-bold text-white min-w-[24px]"
                    style={{ fontFamily: 'var(--font-mono)' }}>{f.broker}</span>
              <div className="flex-1 h-[5px] bg-elevated rounded overflow-hidden">
                <div className="h-full bg-green rounded transition-all duration-500"
                     style={{ width: `${(f.net / maxNet) * 100}%` }} />
              </div>
              <span className="text-[11px] text-green min-w-[40px] text-right"
                    style={{ fontFamily: 'var(--font-mono)' }}>
                +{f.net.toFixed(1)}B
              </span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] text-red font-bold uppercase tracking-wider mb-2">Top Distribution</div>
          {MOCK_FLOWS.filter(f => f.type === 'sell').map((f) => (
            <div key={f.broker} className="flex items-center gap-2 mb-1.5">
              <span className="text-[12px] font-bold text-white min-w-[24px]"
                    style={{ fontFamily: 'var(--font-mono)' }}>{f.broker}</span>
              <div className="flex-1 h-[5px] bg-elevated rounded overflow-hidden">
                <div className="h-full bg-red rounded transition-all duration-500"
                     style={{ width: `${(Math.abs(f.net) / maxNet) * 100}%` }} />
              </div>
              <span className="text-[11px] text-red min-w-[40px] text-right"
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {f.net.toFixed(1)}B
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
