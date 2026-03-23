import useSWR from 'swr'
import { stocksApi, marketApi, aiApi, brokerApi, screenerApi } from '@/lib/api'
import type { Timeframe, ScreenerFilters } from '@/types'

// Generic fetcher
const fetcher = (fn: () => Promise<any>) => fn()

export function useQuote(ticker: string) {
  return useSWR(
    ticker ? `quote-${ticker}` : null,
    () => stocksApi.quote(ticker),
    { refreshInterval: 5000 }
  )
}

export function useCandles(ticker: string, timeframe: Timeframe) {
  return useSWR(
    ticker ? `candles-${ticker}-${timeframe}` : null,
    () => stocksApi.candles(ticker, timeframe),
    { refreshInterval: timeframe === '1m' ? 10000 : 60000 }
  )
}

export function useMarketOverview() {
  return useSWR('market-overview', () => marketApi.overview(), {
    refreshInterval: 15000,
  })
}

export function useMarketIndices() {
  return useSWR('market-indices', () => marketApi.indices(), {
    refreshInterval: 10000,
  })
}

export function useHeatmap() {
  return useSWR('market-heatmap', () => marketApi.heatmap(), {
    refreshInterval: 30000,
  })
}

export function useAIInsight(ticker: string) {
  return useSWR(
    ticker ? `ai-${ticker}` : null,
    () => aiApi.insight(ticker),
    { refreshInterval: 900000 } // 15 min
  )
}

export function useAllAIInsights(limit = 10) {
  return useSWR(`ai-all-${limit}`, () => aiApi.all(limit), {
    refreshInterval: 900000,
  })
}

export function useBrokerFlow(ticker: string, days = 1) {
  return useSWR(
    ticker ? `brokerflow-${ticker}-${days}` : null,
    () => brokerApi.flow(ticker, days),
    { refreshInterval: 60000 }
  )
}

export function useScreener(filters: ScreenerFilters | null) {
  return useSWR(
    filters ? `screener-${JSON.stringify(filters)}` : null,
    () => screenerApi.run(filters!),
    { revalidateOnFocus: false }
  )
}
