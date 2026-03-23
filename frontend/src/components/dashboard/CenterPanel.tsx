'use client'
import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useChartStore } from '@/store'
import { useCandles } from '@/hooks/useMarketData'
import type { Timeframe, Indicator } from '@/types'
import HeatmapPanel from './panels/HeatmapPanel'
import BrokerFlowPanel from './panels/BrokerFlowPanel'
import AlertsPanel from './panels/AlertsPanel'

const CandlestickChart = dynamic(() => import('@/components/charts/CandlestickChart'), { ssr: false })

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '1h', '1D', '1W', '1M']
const INDICATORS: Indicator[] = ['MA', 'RSI', 'MACD', 'VOL']
const BOTTOM_TABS = ['Heatmap', 'Broker Flow', 'Alerts'] as const

const MOCK_QUOTES: Record<string, { price: number; chg: number; pct: number }> = {
  BBCA: { price: 9250, chg: 175,  pct: 1.93  },
  TLKM: { price: 3790, chg: -60,  pct: -1.56 },
  BBRI: { price: 5275, chg: 100,  pct: 1.93  },
  ASII: { price: 4820, chg: -30,  pct: -0.62 },
  BMRI: { price: 7100, chg: 125,  pct: 1.79  },
  GOTO: { price: 68,   chg: -3,   pct: -4.23 },
  ADRO: { price: 2340, chg: 55,   pct: 2.41  },
  ANTM: { price: 1680, chg: 35,   pct: 2.13  },
  PTBA: { price: 2780, chg: 80,   pct: 2.96  },
}

interface CenterPanelProps {
  ticker: string
}

export default function CenterPanel({ ticker }: CenterPanelProps) {
  const { timeframe, indicators, setTimeframe, toggleIndicator } = useChartStore()
  const [bottomTab, setBottomTab] = useState<string>('Heatmap')

  // Use mock OHLCV for demo (replace with useCandles hook when backend is live)
  const quote = MOCK_QUOTES[ticker] ?? MOCK_QUOTES['BBCA']
  const isUp = quote.pct >= 0

  // Generate mock candles
  const mockCandles = (() => {
    const candles = []
    let price = quote.price * 0.92
    const now = Math.floor(Date.now() / 1000)
    for (let i = 80; i >= 0; i--) {
      const o = price
      const c = o + (Math.random() - 0.46) * price * 0.012
      const h = Math.max(o, c) + Math.random() * price * 0.005
      const l = Math.min(o, c) - Math.random() * price * 0.005
      candles.push({ time: now - i * 86400, open: Math.round(o), high: Math.round(h), low: Math.round(l), close: Math.round(c), volume: Math.round(Math.random() * 5e7 + 1e7) })
      price = c
    }
    return candles
  })()

  return (
    <div className="flex flex-col h-full">

      {/* CHART AREA */}
      <div className="flex-1 bg-deep border-b border-[#142035] flex flex-col min-h-0">

        {/* Chart Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#142035] flex-wrap gap-y-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">{ticker}</span>
              <span className={`text-2xl font-bold ${isUp ? 'text-green' : 'text-red'}`}
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {quote.price.toLocaleString()}
              </span>
              <span className={`text-[13px] font-bold ${isUp ? 'text-green' : 'text-red'}`}
                    style={{ fontFamily: 'var(--font-mono)' }}>
                {isUp ? '+' : ''}{quote.chg} ({isUp ? '+' : ''}{quote.pct.toFixed(2)}%)
              </span>
            </div>
            <div className="text-[11px] text-[#3a5270] mt-0.5">IDX · IDR · Real-time</div>
          </div>

          {/* Timeframes */}
          <div className="ml-auto flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all
                  ${timeframe === tf
                    ? 'bg-green text-void'
                    : 'bg-panel border border-[#142035] text-[#7a9bc4] hover:text-white'
                  }`}
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex gap-1.5">
            {INDICATORS.map((ind) => (
              <button
                key={ind}
                onClick={() => toggleIndicator(ind)}
                className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded transition-all
                  ${indicators.includes(ind)
                    ? 'border border-purple/60 text-purple bg-purple/10'
                    : 'border border-[#142035] text-[#3a5270] hover:text-[#7a9bc4]'
                  }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="flex-1 min-h-0 p-2">
          <CandlestickChart
            candles={mockCandles}
            indicators={indicators}
            height={280}
          />
        </div>
      </div>

      {/* BOTTOM TABS */}
      <div className="flex bg-panel border-b border-[#142035] flex-shrink-0">
        {BOTTOM_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setBottomTab(tab)}
            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider
                        border-b-2 border-r border-[#142035] transition-all
              ${bottomTab === tab
                ? 'text-green border-b-green bg-deep'
                : 'text-[#3a5270] border-b-transparent hover:text-[#7a9bc4] hover:bg-[#162440]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* BOTTOM CONTENT */}
      <div className="overflow-auto flex-shrink-0" style={{ maxHeight: '260px' }}>
        {bottomTab === 'Heatmap'     && <HeatmapPanel />}
        {bottomTab === 'Broker Flow' && <BrokerFlowPanel ticker={ticker} />}
        {bottomTab === 'Alerts'      && <AlertsPanel />}
      </div>

    </div>
  )
}
