'use client'
import { useEffect, useRef } from 'react'
import type { Candle, Indicator } from '@/types'

interface ChartProps {
  candles: Candle[]
  indicators: Indicator[]
  height?: number
}

export default function CandlestickChart({ candles, indicators, height = 300 }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const candleSeriesRef = useRef<any>(null)
  const maSeriesRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    // Dynamically import TradingView Lightweight Charts
    import('lightweight-charts').then(({ createChart, CrosshairMode }) => {
      if (!containerRef.current) return

      // Destroy previous chart
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }

      const chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: {
          background: { color: '#070d1a' },
          textColor: '#7a9bc4',
        },
        grid: {
          vertLines: { color: '#142035' },
          horzLines: { color: '#142035' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: { color: '#1e3550', labelBackgroundColor: '#0a1220' },
          horzLine: { color: '#1e3550', labelBackgroundColor: '#0a1220' },
        },
        rightPriceScale: {
          borderColor: '#142035',
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        timeScale: {
          borderColor: '#142035',
          timeVisible: true,
        },
      })

      chartRef.current = chart

      // Candlestick series
      const candleSeries = chart.addCandlestickSeries({
        upColor:        '#00ff9d',
        downColor:      '#ff3b5c',
        borderUpColor:  '#00ff9d',
        borderDownColor:'#ff3b5c',
        wickUpColor:    '#00ff9d',
        wickDownColor:  '#ff3b5c',
      })
      candleSeriesRef.current = candleSeries

      // Format and set data
      const formatted = candles.map((c) => ({
        time: c.time as any,
        open:  c.open,
        high:  c.high,
        low:   c.low,
        close: c.close,
      }))
      candleSeries.setData(formatted)

      // MA indicator
      if (indicators.includes('MA') && candles.length >= 20) {
        const maSeries = chart.addLineSeries({
          color: '#7c5cfc',
          lineWidth: 1,
          priceLineVisible: false,
        })
        const period = 20
        const maData = candles.slice(period).map((_, i) => {
          const slice = candles.slice(i, i + period)
          const avg = slice.reduce((a, b) => a + b.close, 0) / period
          return { time: candles[i + period].time as any, value: avg }
        })
        maSeries.setData(maData)
        maSeriesRef.current = maSeries
      }

      // Responsive resize
      const ro = new ResizeObserver(() => {
        if (containerRef.current && chartRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth })
        }
      })
      ro.observe(containerRef.current)

      chart.timeScale().fitContent()

      return () => {
        ro.disconnect()
        chart.remove()
      }
    })
  }, [candles, indicators, height])

  return (
    <div ref={containerRef} style={{ width: '100%', height }} />
  )
}
