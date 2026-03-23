// ===== STOCK TYPES =====
export interface StockQuote {
  ticker: string
  price: number
  open: number
  high: number
  low: number
  prev_close: number
  volume: number
  market_cap: number | null
  change: number
  change_pct: number
  timestamp: string
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface MarketIndex {
  name: string
  ticker: string
  price: number
  change: number
  change_pct: number
}

// ===== BROKER FLOW TYPES =====
export interface BrokerFlowItem {
  broker: string
  buy_value: number
  sell_value: number
  net_value: number
  type: 'buy' | 'sell'
}

export interface BrokerFlowData {
  ticker: string
  flows: BrokerFlowItem[]
  top_accumulation: BrokerFlowItem[]
  top_distribution: BrokerFlowItem[]
  total_buy: number
  total_sell: number
  net_flow: number
}

// ===== AI TYPES =====
export type Sentiment = 'bullish' | 'bearish' | 'neutral'

export interface AIInsight {
  ticker: string
  sentiment: Sentiment
  trend: string
  summary: string
  risk_level: number
  confidence: number
  price_target: number
  indicators: {
    rsi: number
    macd: number
    macd_signal: number
    macd_histogram: number
    ma20: number | null
    ma50: number | null
    ma200: number | null
    golden_cross: boolean
    volume_ratio: number
  }
}

// ===== SCREENER TYPES =====
export interface ScreenerFilters {
  min_change_pct?: number
  min_volume?: number
  breakout?: boolean
  unusual_volume?: boolean
  high_momentum?: boolean
  foreign_accumulation?: boolean
}

// ===== WATCHLIST / ALERT TYPES =====
export interface WatchlistItem extends StockQuote {}

export type AlertType =
  | 'price_breakout'
  | 'price_drop'
  | 'volume_spike'
  | 'rsi_oversold'
  | 'rsi_overbought'
  | 'broker_accumulation'
  | 'broker_distribution'

export interface Alert {
  id: number
  ticker: string
  alert_type: AlertType
  target_value: number | null
  is_active: boolean
  created_at: string
  triggered_at?: string
}

// ===== WEBSOCKET TYPES =====
export interface PriceTick {
  type: 'tick'
  ticker: string
  price: number
  change: number
  change_pct: number
  volume: number
}

// ===== UI TYPES =====
export type Timeframe = '1m' | '5m' | '1h' | '1D' | '1W' | '1M'
export type Indicator = 'MA' | 'RSI' | 'MACD' | 'VOL'
