'use client'
import { TrendingUp, TrendingDown, Minus, Brain } from 'lucide-react'

const AI_INSIGHTS = [
  {
    sym: 'BBCA', name: 'Bank Central Asia', sentiment: 'bullish', trend: 'Uptrend',
    summary: 'Strong support at 9,000 level dengan increasing institutional accumulation. Moving averages showing golden cross formation. Volume konsisten tinggi. Target teknikal: 9,800.',
    risk: 2, confidence: 87, target: 9800,
    indicators: { rsi: 62, macd: 12.4, golden_cross: true, volume_ratio: 1.4 }
  },
  {
    sym: 'TLKM', name: 'Telekomunikasi Indonesia', sentiment: 'bearish', trend: 'Downtrend',
    summary: 'Breaking below 200-day MA dengan increasing sell pressure dari foreign investors. RSI approaching oversold territory. Watch support kritis di 3,650.',
    risk: 4, confidence: 74, target: 3500,
    indicators: { rsi: 38, macd: -8.2, golden_cross: false, volume_ratio: 1.2 }
  },
  {
    sym: 'ADRO', name: 'Adaro Energy', sentiment: 'bullish', trend: 'Uptrend',
    summary: 'Coal sector momentum berlanjut dengan positive global commodity outlook. High volume breakout di atas resistance. Fibonacci extension target: 2,600.',
    risk: 3, confidence: 81, target: 2600,
    indicators: { rsi: 64, macd: 18.6, golden_cross: true, volume_ratio: 1.8 }
  },
  {
    sym: 'GOTO', name: 'GoTo Gojek Tokopedia', sentiment: 'bearish', trend: 'Downtrend',
    summary: 'Continued weakness dengan low RSI. Foreign net sell accumulating over 5 sessions. Caution advised until reversal signal confirmed di 60 area.',
    risk: 5, confidence: 68, target: 55,
    indicators: { rsi: 32, macd: -4.1, golden_cross: false, volume_ratio: 2.1 }
  },
  {
    sym: 'ANTM', name: 'Aneka Tambang', sentiment: 'bullish', trend: 'Uptrend',
    summary: 'Nickel prices supporting upside. Broker accumulation detected dari institutional players BK dan YP. RSI dalam healthy momentum zone dengan MACD positif.',
    risk: 2, confidence: 79, target: 1950,
    indicators: { rsi: 63, macd: 9.8, golden_cross: true, volume_ratio: 1.6 }
  },
]

const SENTIMENT_CONFIG = {
  bullish: { color: 'text-green', bg: 'bg-green/10 border-green/25', icon: TrendingUp,  label: 'BULLISH' },
  bearish: { color: 'text-red',   bg: 'bg-red/10   border-red/25',   icon: TrendingDown,label: 'BEARISH' },
  neutral: { color: 'text-amber', bg: 'bg-amber/10 border-amber/25', icon: Minus,       label: 'NEUTRAL' },
}

export default function AIInsightsPage() {
  return (
    <div className="p-6 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <Brain size={22} className="text-purple" />
        <h1 className="text-2xl font-bold text-white">AI Market Insights</h1>
      </div>
      <p className="text-[13px] text-[#3a5270] mb-6">
        Powered by machine learning · Technical analysis · Updated every 15 minutes
      </p>

      <div className="space-y-4">
        {AI_INSIGHTS.map((ai) => {
          const cfg = SENTIMENT_CONFIG[ai.sentiment as keyof typeof SENTIMENT_CONFIG]
          const Icon = cfg.icon
          return (
            <div
              key={ai.sym}
              className="rounded-xl p-5 border"
              style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.06), rgba(0,136,255,0.04))', borderColor: 'rgba(124,92,252,0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[9px] font-bold tracking-wider px-2 py-1 rounded border ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                  {ai.sym}
                </span>
                <span className="text-[13px] text-[#7a9bc4]">{ai.name}</span>
                <div className={`ml-auto flex items-center gap-1 ${cfg.color}`}>
                  <Icon size={14} />
                  <span className="text-[12px] font-bold">{ai.trend}</span>
                </div>
              </div>

              {/* Summary */}
              <p className="text-[13px] text-[#7a9bc4] leading-relaxed mb-4">{ai.summary}</p>

              {/* Metrics row */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="text-[11px]">
                  <span className="text-[#3a5270]">RSI </span>
                  <span className={`font-bold ${ai.indicators.rsi > 60 ? 'text-green' : ai.indicators.rsi < 40 ? 'text-red' : 'text-amber'}`}
                        style={{ fontFamily: 'var(--font-mono)' }}>{ai.indicators.rsi}</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-[#3a5270]">MACD </span>
                  <span className={`font-bold ${ai.indicators.macd > 0 ? 'text-green' : 'text-red'}`}
                        style={{ fontFamily: 'var(--font-mono)' }}>{ai.indicators.macd > 0 ? '+' : ''}{ai.indicators.macd}</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-[#3a5270]">Golden Cross </span>
                  <span className={`font-bold ${ai.indicators.golden_cross ? 'text-green' : 'text-red'}`}>
                    {ai.indicators.golden_cross ? '✓ YES' : '✗ NO'}
                  </span>
                </div>
                <div className="text-[11px]">
                  <span className="text-[#3a5270]">Vol Ratio </span>
                  <span className={`font-bold ${ai.indicators.volume_ratio > 1.5 ? 'text-green' : 'text-[#7a9bc4]'}`}
                        style={{ fontFamily: 'var(--font-mono)' }}>{ai.indicators.volume_ratio.toFixed(1)}x</span>
                </div>
                <div className="text-[11px]">
                  <span className="text-[#3a5270]">Target </span>
                  <span className="font-bold text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                    {ai.target.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Risk + Confidence */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#3a5270]">Risk</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(d => (
                      <div key={d} className={`w-2 h-2 rounded-full ${d <= ai.risk ? 'bg-amber' : 'bg-elevated border border-[#1e3550]'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#3a5270]">
                    {['','Very Low','Low','Medium','High','Very High'][ai.risk]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#3a5270]">Confidence</span>
                  <div className="w-20 h-1.5 bg-elevated rounded overflow-hidden">
                    <div className="h-full bg-purple rounded" style={{ width: `${ai.confidence}%` }} />
                  </div>
                  <span className="text-[11px] text-purple font-bold">{ai.confidence}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
