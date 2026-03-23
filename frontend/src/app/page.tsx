'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import TickerBar from '@/components/ui/TickerBar'
import LeftPanel from '@/components/dashboard/LeftPanel'
import CenterPanel from '@/components/dashboard/CenterPanel'
import RightPanel from '@/components/dashboard/RightPanel'
import MarketsPage from '@/components/dashboard/pages/MarketsPage'
import ScreenerPage from '@/components/dashboard/pages/ScreenerPage'
import BrokerFlowPage from '@/components/dashboard/pages/BrokerFlowPage'
import AIInsightsPage from '@/components/dashboard/pages/AIInsightsPage'
import WatchlistPage from '@/components/dashboard/pages/WatchlistPage'

export type NavTab = 'dashboard' | 'markets' | 'screener' | 'brokerflow' | 'ai' | 'watchlist'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard')
  const [selectedTicker, setSelectedTicker] = useState('BBCA')

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-void">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <TickerBar onTickerClick={setSelectedTicker} />

      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && (
          <div className="flex h-full">
            <LeftPanel onTickerSelect={setSelectedTicker} />
            <motion.div
              key="center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-auto"
            >
              <CenterPanel ticker={selectedTicker} />
            </motion.div>
            <RightPanel onTickerSelect={setSelectedTicker} />
          </div>
        )}

        {activeTab === 'markets' && (
          <motion.div key="markets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto">
            <MarketsPage onTickerSelect={setSelectedTicker} />
          </motion.div>
        )}

        {activeTab === 'screener' && (
          <motion.div key="screener" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto">
            <ScreenerPage onTickerSelect={setSelectedTicker} />
          </motion.div>
        )}

        {activeTab === 'brokerflow' && (
          <motion.div key="brokerflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto">
            <BrokerFlowPage />
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto">
            <AIInsightsPage />
          </motion.div>
        )}

        {activeTab === 'watchlist' && (
          <motion.div key="watchlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-auto">
            <WatchlistPage onTickerSelect={setSelectedTicker} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
