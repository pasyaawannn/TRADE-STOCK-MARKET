'use client'
import { useEffect, useRef, useCallback } from 'react'
import { usePriceStore } from '@/store'
import type { PriceTick } from '@/types'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export function useWebSocket(tickers?: string[]) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>()
  const updateTick = usePriceStore((s) => s.updateTick)

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/ws/prices`)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('✅ WS connected')
        if (tickers?.length) {
          ws.send(JSON.stringify({ action: 'subscribe', tickers }))
        }
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data) as PriceTick
          if (msg.type === 'tick') {
            updateTick(msg)
          }
        } catch {}
      }

      ws.onclose = () => {
        console.log('🔄 WS disconnected, reconnecting...')
        reconnectTimer.current = setTimeout(connect, 3000)
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch (err) {
      reconnectTimer.current = setTimeout(connect, 5000)
    }
  }, [tickers, updateTick])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  return wsRef
}
