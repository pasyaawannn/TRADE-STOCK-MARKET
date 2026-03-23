'use client'
import { useState } from 'react'
import { Bell, Plus, X } from 'lucide-react'

interface Alert {
  id: number
  sym: string
  type: string
  target: string
  status: 'active' | 'triggered' | 'warning'
}

const INITIAL_ALERTS: Alert[] = [
  { id: 1, sym: 'BBCA', type: 'Price Breakout', target: '9,500',     status: 'active'   },
  { id: 2, sym: 'TLKM', type: 'Volume Spike',   target: '>150M',     status: 'warning'  },
  { id: 3, sym: 'GOTO', type: 'Broker Accum.',  target: 'BK >10B',   status: 'triggered'},
]

const STATUS_COLORS = {
  active:    'bg-green animate-pulse-dot',
  triggered: 'bg-red',
  warning:   'bg-amber',
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [sym, setSym]       = useState('')
  const [type, setType]     = useState('Price Breakout')
  const [target, setTarget] = useState('')

  const add = () => {
    if (!sym || !target) return
    setAlerts(prev => [...prev, {
      id: Date.now(), sym: sym.toUpperCase(), type, target, status: 'active'
    }])
    setSym(''); setTarget('')
  }

  const remove = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id))

  return (
    <div className="p-4">
      <div className="text-[10px] text-[#3a5270] font-bold uppercase tracking-wider mb-3">
        Active Alerts
      </div>

      {/* Alert list */}
      <div className="mb-4">
        {alerts.map((a) => (
          <div key={a.id} className="flex items-center gap-3 py-2 border-b border-[#142035]">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_COLORS[a.status]}`} />
            <span className="text-[12px] font-bold text-white min-w-[40px]"
                  style={{ fontFamily: 'var(--font-mono)' }}>{a.sym}</span>
            <span className="flex-1 text-[12px] text-[#7a9bc4]">{a.type}</span>
            <span className="text-[11px] text-[#3a5270]">{a.target}</span>
            <button onClick={() => remove(a.id)}
                    className="text-[#3a5270] hover:text-red transition-colors ml-1">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Create alert */}
      <div className="text-[10px] text-[#3a5270] font-bold uppercase tracking-wider mb-2">
        Create Alert
      </div>
      <div className="flex gap-2 flex-wrap">
        <input
          value={sym}
          onChange={e => setSym(e.target.value)}
          placeholder="Ticker"
          className="trading-input w-20"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="trading-input"
          style={{ background: '#111f35' }}
        >
          <option>Price Breakout</option>
          <option>Price Drop</option>
          <option>Volume Spike</option>
          <option>RSI Oversold</option>
          <option>Broker Accumulation</option>
        </select>
        <input
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="Target value"
          className="trading-input w-28"
        />
        <button onClick={add} className="btn-primary flex items-center gap-1.5 text-xs">
          <Plus size={12} /> Set Alert
        </button>
      </div>
    </div>
  )
}
