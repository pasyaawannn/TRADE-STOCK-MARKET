import axios from 'axios'
import type {
  StockQuote, Candle, MarketIndex,
  BrokerFlowData, AIInsight, ScreenerFilters,
  WatchlistItem, Alert, Timeframe,
} from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 15000,
})

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('pasya_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== STOCKS =====
export const stocksApi = {
  list: () => api.get('/api/v1/stocks/').then(r => r.data),
  quote: (ticker: string): Promise<StockQuote> =>
    api.get(`/api/v1/stocks/${ticker}`).then(r => r.data),
  candles: (ticker: string, timeframe: Timeframe): Promise<{ candles: Candle[] }> =>
    api.get(`/api/v1/stocks/${ticker}/candles`, { params: { timeframe } }).then(r => r.data),
  summary: (ticker: string) =>
    api.get(`/api/v1/stocks/${ticker}/summary`).then(r => r.data),
}

// ===== MARKET =====
export const marketApi = {
  indices: (): Promise<{ indices: MarketIndex[] }> =>
    api.get('/api/v1/market/indices').then(r => r.data),
  movers: () => api.get('/api/v1/market/movers').then(r => r.data),
  heatmap: () => api.get('/api/v1/market/heatmap').then(r => r.data),
  overview: () => api.get('/api/v1/market/overview').then(r => r.data),
}

// ===== SCREENER =====
export const screenerApi = {
  run: (filters: ScreenerFilters): Promise<{ results: StockQuote[]; count: number }> =>
    api.post('/api/v1/screener/', filters).then(r => r.data),
  preset: (preset: string) =>
    api.get(`/api/v1/screener/presets/${preset}`).then(r => r.data),
}

// ===== BROKER FLOW =====
export const brokerApi = {
  flow: (ticker: string, days = 1): Promise<BrokerFlowData> =>
    api.get(`/api/v1/brokerflow/${ticker}`, { params: { days } }).then(r => r.data),
}

// ===== AI =====
export const aiApi = {
  insight: (ticker: string): Promise<AIInsight> =>
    api.get(`/api/v1/ai/${ticker}`).then(r => r.data),
  all: (limit = 10): Promise<{ insights: AIInsight[] }> =>
    api.get('/api/v1/ai/', { params: { limit } }).then(r => r.data),
}

// ===== AUTH =====
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login', { email, password }).then(r => r.data),
  register: (email: string, password: string, username: string) =>
    api.post('/api/v1/auth/register', { email, password, username }).then(r => r.data),
  me: () => api.get('/api/v1/auth/me').then(r => r.data),
}

// ===== WATCHLIST =====
export const watchlistApi = {
  get: (): Promise<{ watchlist: WatchlistItem[] }> =>
    api.get('/api/v1/watchlist/').then(r => r.data),
  add: (ticker: string) =>
    api.post('/api/v1/watchlist/', { ticker }).then(r => r.data),
  remove: (ticker: string) =>
    api.delete(`/api/v1/watchlist/${ticker}`).then(r => r.data),
}

// ===== ALERTS =====
export const alertsApi = {
  get: (): Promise<{ alerts: Alert[] }> =>
    api.get('/api/v1/alerts/').then(r => r.data),
  create: (ticker: string, alert_type: string, target_value?: number) =>
    api.post('/api/v1/alerts/', { ticker, alert_type, target_value }).then(r => r.data),
  delete: (id: number) =>
    api.delete(`/api/v1/alerts/${id}`).then(r => r.data),
}

export default api
