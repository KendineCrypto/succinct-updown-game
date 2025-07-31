import { useEffect, useState } from 'react'
import './App.css'
import Bid from './components/Bid'
import EarnPointsModal from './components/EarnPointsModal'
import LeaderboardModal from './components/LeaderboardModal'
import Result from './components/Result'
import Timer from './components/Timer'
import UsernameModal from './components/UsernameModal'
import useAIRStore from './store/useAIRStore'
import useGameStore, { PHASES } from './store/useGameStore'

function App() {
  const { phase, startNewRound, score, resetEarnIfNeeded } = useGameStore()
  const { startPricePolling } = useAIRStore()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showEarn, setShowEarn] = useState(false)

  useEffect(() => {
    startNewRound()
    resetEarnIfNeeded()
    
    // AIR fiyat verilerini başlat
    const cleanup = startPricePolling()
    
    return cleanup
  }, [startNewRound, resetEarnIfNeeded, startPricePolling])

  return (
    <div className="min-h-screen bg-blue-100 text-gray-800 p-4 relative overflow-hidden font-mono">
      <UsernameModal />
      <LeaderboardModal open={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <EarnPointsModal open={showEarn} onClose={() => setShowEarn(false)} />
      {/* Large background logo */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
        <img src="/air.png" alt="$AIR Logo" style={{width:900, height:900, opacity:0.10}} />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-2 gap-2">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="retro-btn"
          >
            Leaderboard
          </button>
          <button
            onClick={() => setShowEarn(true)}
            className="retro-btn"
          >
            Earn Points
          </button>
        </div>
        {/* $AIR TOKEN Logo (small, top) */}
        <div className="flex justify-center mb-4">
          <img src="/air.png" alt="$AIR Logo" style={{width:96, height:96}} />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-700">
          $AIR Price Prediction Game
        </h1>
        <div className="space-y-8">
          {phase === PHASES.BID && <Bid />}
          {phase === PHASES.WAIT && <Timer />}
          {phase === PHASES.RESULT && <Result />}
        </div>
      </div>
    </div>
  )
}

export default App 