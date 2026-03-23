'use client'

const SECTORS = [
  { sym: 'BBCA', name: 'Finance',  pct: 1.93,  size: 'big' },
  { sym: 'BBRI', name: 'Finance',  pct: 1.93,  size: 'big' },
  { sym: 'TLKM', name: 'Telecom',  pct: -1.56, size: 'normal' },
  { sym: 'ASII', name: 'Auto',     pct: -0.62, size: 'normal' },
  { sym: 'BMRI', name: 'Finance',  pct: 1.79,  size: 'normal' },
  { sym: 'GOTO', name: 'Tech',     pct: -4.23, size: 'normal' },
  { sym: 'ADRO', name: 'Energy',   pct: 2.41,  size: 'normal' },
  { sym: 'PTBA', name: 'Energy',   pct: 2.96,  size: 'normal' },
  { sym: 'ANTM', name: 'Mining',   pct: 2.13,  size: 'normal' },
  { sym: 'INDF', name: 'Consumer', pct: 1.22,  size: 'normal' },
  { sym: 'KLBF', name: 'Health',   pct: 1.56,  size: 'normal' },
  { sym: 'SMGR', name: 'Material', pct: -1.44, size: 'normal' },
]

function getColor(pct: number) {
  if (pct >  3) return '#00aa55'
  if (pct >  1.5) return '#008840'
  if (pct >  0) return '#006633'
  if (pct > -1.5) return '#881833'
  if (pct > -3) return '#aa2240'
  return '#cc3355'
}

export default function HeatmapPanel() {
  return (
    <div className="p-3">
      <div className="text-[10px] text-[#3a5270] font-bold uppercase tracking-wider mb-2">
        Sector Heatmap — IDX
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {SECTORS.map((s) => (
          <div
            key={s.sym}
            className={`rounded flex flex-col items-center justify-center cursor-pointer
                        transition-transform hover:scale-105 ${s.size === 'big' ? 'col-span-2' : ''}`}
            style={{ background: getColor(s.pct), aspectRatio: s.size === 'big' ? '2/1' : '1/1' }}
          >
            <div className="text-[11px] font-bold text-white/95">{s.sym}</div>
            <div className="text-[10px] text-white/75">
              {s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
