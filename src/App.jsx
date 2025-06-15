import { useEffect, useState } from 'react'
import Bid from './components/Bid'
import EarnPointsModal from './components/EarnPointsModal'
import LeaderboardModal from './components/LeaderboardModal'
import Result from './components/Result'
import Timer from './components/Timer'
import UsernameModal from './components/UsernameModal'
import useGameStore, { PHASES } from './store/useGameStore'

function App() {
  const { phase, startNewRound, score, resetEarnIfNeeded } = useGameStore()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showEarn, setShowEarn] = useState(false)

  useEffect(() => {
    startNewRound()
    resetEarnIfNeeded()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-950 via-pink-900 to-pink-950 text-white p-4 relative overflow-hidden">
      <UsernameModal />
      <LeaderboardModal open={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <EarnPointsModal open={showEarn} onClose={() => setShowEarn(false)} />
      {/* Large background logo */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
        <img src="/logo.svg" alt="$PROVE Logo" style={{width:900, height:900, opacity:0.10}} />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-2 gap-2">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-pink-700 hover:bg-pink-800 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200"
          >
            Leaderboard
          </button>
          <button
            onClick={() => setShowEarn(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all duration-200"
          >
            Earn Points
          </button>
        </div>
        {/* $PROVE TOKEN Logo (small, top) */}
        <div className="flex justify-center mb-4">
          <img src="/logo.svg" alt="$PROVE Logo" style={{width:96, height:96}} />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8 text-pink-200">
          $PROVE Price Prediction Game
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