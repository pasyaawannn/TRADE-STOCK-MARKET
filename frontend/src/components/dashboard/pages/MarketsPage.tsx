'use client'
// ===== MARKETS PAGE =====
export default function MarketsPage({ onTickerSelect }: { onTickerSelect: (t: string) => void }) {
  const GLOBAL = [
    { name: 'S&P 500',   val: '5,823', chg: '+0.42%', up: true,  region: 'US'     },
    { name: 'NASDAQ',    val: '18,912',chg: '+0.67%', up: true,  region: 'US'     },
    { name: 'DOW',       val: '42,104',chg: '+0.18%', up: true,  region: 'US'     },
    { name: 'Nikkei 225',val: '38,240',chg: '-0.33%', up: false, region: 'Japan'  },
    { name: 'Hang Seng', val: '18,650',chg: '-1.12%', up: false, region: 'HK'     },
    { name: 'STI',       val: '3,512', chg: '+0.55%', up: true,  region: 'SG'     },
    { name: 'SET',       val: '1,295', chg: '-0.22%', up: false, region: 'TH'     },
    { name: 'KLCI',      val: '1,612', chg: '+0.38%', up: true,  region: 'MY'     },
  ]

  const IDX_ALL = [
    { sym: 'BBCA', name: 'Bank Central Asia',      price: 9250, pct:  1.93, vol: 85.2,  sec: 'Finance'  },
    { sym: 'TLKM', name: 'Telekomunikasi Indonesia',price: 3790, pct: -1.56, vol: 120.4, sec: 'Telecom'  },
    { sym: 'BBRI', name: 'Bank Rakyat Indonesia',  price: 5275, pct:  1.93, vol: 200.7, sec: 'Finance'  },
    { sym: 'ASII', name: 'Astra International',    price: 4820, pct: -0.62, vol: 95.3,  sec: 'Auto'     },
    { sym: 'BMRI', name: 'Bank Mandiri',           price: 7100, pct:  1.79, vol: 67.8,  sec: 'Finance'  },
    { sym: 'UNVR', name: 'Unilever Indonesia',     price: 2180, pct:  1.87, vol: 44.2,  sec: 'Consumer' },
    { sym: 'GOTO', name: 'GoTo Gojek Tokopedia',   price: 68,   pct: -4.23, vol: 890.5, sec: 'Tech'     },
    { sym: 'ADRO', name: 'Adaro Energy',           price: 2340, pct:  2.41, vol: 78.4,  sec: 'Energy'   },
    { sym: 'PTBA', name: 'Bukit Asam',             price: 2780, pct:  2.96, vol: 65.1,  sec: 'Energy'   },
    { sym: 'ANTM', name: 'Aneka Tambang',          price: 1680, pct:  2.13, vol: 110.3, sec: 'Mining'   },
    { sym: 'KLBF', name: 'Kalbe Farma',            price: 1625, pct:  1.56, vol: 41.2,  sec: 'Health'   },
    { sym: 'SMGR', name: 'Semen Indonesia',        price: 5150, pct: -1.44, vol: 22.6,  sec: 'Material' },
  ]

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Global Markets Overview</h1>
      <p className="text-[13px] text-[#3a5270] mb-6">Real-time global indices and IDX stock data</p>

      {/* Global Indices Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {GLOBAL.map((m) => (
          <div key={m.name} className="bg-panel border border-[#142035] rounded-lg p-3">
            <div className="text-[10px] text-[#3a5270] font-bold uppercase tracking-wider">{m.region}</div>
            <div className="text-[13px] text-[#7a9bc4] mt-0.5">{m.name}</div>
            <div className="text-[20px] font-bold text-white mt-1" style={{ fontFamily: 'var(--font-mono)' }}>{m.val}</div>
            <div className={`text-[12px] font-bold ${m.up ? 'text-green' : 'text-red'}`}
                 style={{ fontFamily: 'var(--font-mono)' }}>{m.chg}</div>
          </div>
        ))}
      </div>

      {/* IDX Table */}
      <div className="bg-panel border border-[#142035] rounded-lg overflow-auto">
        <div className="p-4 border-b border-[#142035]">
          <div className="section-title">IDX Stocks</div>
        </div>
        <table className="trading-table">
          <thead>
            <tr>
              <th>Ticker</th><th>Name</th><th>Price</th>
              <th>Change</th><th>Volume (M)</th><th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {IDX_ALL.map((s) => {
              const up = s.pct >= 0
              return (
                <tr key={s.sym} className="cursor-pointer" onClick={() => onTickerSelect(s.sym)}>
                  <td className="text-green font-bold">{s.sym}</td>
                  <td className="text-[#7a9bc4] text-[11px]">{s.name}</td>
                  <td className="text-white">{s.price.toLocaleString()}</td>
                  <td className={up ? 'text-green' : 'text-red'}>{up ? '+' : ''}{s.pct.toFixed(2)}%</td>
                  <td className="text-[#7a9bc4]">{s.vol.toFixed(1)}</td>
                  <td className="text-[#3a5270] text-[11px]">{s.sec}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
