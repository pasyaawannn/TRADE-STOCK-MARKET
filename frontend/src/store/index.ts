import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StockQuote, PriceTick, Timeframe, Indicator, Sentiment } from '@/types'

// ===== PRICE STORE (live ticks) =====
interface PriceStore {
  prices: Record<string, PriceTick>
  updateTick: (tick: PriceTick) => void
}

export const usePriceStore = create<PriceStore>((set) => ({
  prices: {},
  updateTick: (tick) =>
    set((state) => ({
      prices: { ...state.prices, [tick.ticker]: tick },
    })),
}))

// ===== CHART STORE =====
interface ChartStore {
  selectedTicker: string
  timeframe: Timeframe
  indicators: Indicator[]
  setTicker: (ticker: string) => void
  setTimeframe: (tf: Timeframe) => void
  toggleIndicator: (ind: Indicator) => void
}

export const useChartStore = create<ChartStore>((set) => ({
  selectedTicker: 'BBCA',
  timeframe: '1D',
  indicators: ['MA'],
  setTicker: (ticker) => set({ selectedTicker: ticker }),
  setTimeframe: (timeframe) => set({ timeframe }),
  toggleIndicator: (ind) =>
    set((state) => ({
      indicators: state.indicators.includes(ind)
        ? state.indicators.filter((i) => i !== ind)
        : [...state.indicators, ind],
    })),
}))

// ===== WATCHLIST STORE (persisted) =====
interface WatchlistStore {
  tickers: string[]
  add: (ticker: string) => void
  remove: (ticker: string) => void
  has: (ticker: string) => boolean
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      tickers: ['BBCA', 'TLKM', 'BBRI', 'BMRI'],
      add: (ticker) =>
        set((state) => ({
          tickers: state.tickers.includes(ticker)
            ? state.tickers
            : [...state.tickers, ticker.toUpperCase()],
        })),
      remove: (ticker) =>
        set((state) => ({
          tickers: state.tickers.filter((t) => t !== ticker),
        })),
      has: (ticker) => get().tickers.includes(ticker),
    }),
    { name: 'pasya-watchlist' }
  )
)

// ===== AUTH STORE (persisted) =====
interface AuthStore {
  token: string | null
  username: string | null
  isLoggedIn: boolean
  login: (token: string, username: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      isLoggedIn: false,
      login: (token, username) => {
        if (typeof window !== 'undefined') localStorage.setItem('pasya_token', token)
        set({ token, username, isLoggedIn: true })
      },
      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('pasya_token')
        set({ token: null, username: null, isLoggedIn: false })
      },
    }),
    { name: 'pasya-auth' }
  )
)

// ===== UI STORE =====
interface UIStore {
  activeNav: string
  activeBottomTab: string
  sidebarCollapsed: boolean
  setActiveNav: (nav: string) => void
  setBottomTab: (tab: string) => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeNav: 'dashboard',
  activeBottomTab: 'heatmap',
  sidebarCollapsed: false,
  setActiveNav: (activeNav) => set({ activeNav }),
  setBottomTab: (activeBottomTab) => set({ activeBottomTab }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
