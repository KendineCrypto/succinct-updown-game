import useGameStore from '../store/useGameStore'

export default function EarnPointsModal({ open, onClose }) {
  const earnPoints = useGameStore(s => s.earnPoints)
  const canEarnPoints = useGameStore(s => s.canEarnPoints)()
  const dailyEarnedPoints = useGameStore(s => s.dailyEarnedPoints)

  if (!open) return null

  const remaining = 5000 - dailyEarnedPoints

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="retro-panel p-8 min-w-[320px] max-w-xs w-full relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="retro-btn-square absolute top-4 right-4"
          style={{ zIndex: 60 }}
        >×</button>
        <div className="retro-panel-header mb-4">
          <h2 className="text-xl font-bold text-center">Earn Points</h2>
        </div>
        <div className="mb-4 text-gray-700 text-center">
          Click the $AIR logo to earn <span className="font-bold text-blue-600">+500</span> points!<br/>
          <span className="text-xs">(Max 5000 per day)</span>
        </div>
        <button
          onClick={canEarnPoints ? earnPoints : undefined}
          disabled={!canEarnPoints}
          className={`transition-all duration-200 ${canEarnPoints ? 'hover:scale-110 active:scale-95' : 'opacity-40 cursor-not-allowed'}`}
          style={{ outline: 'none', border: 'none', background: 'none', marginBottom: 16 }}
        >
          <img src="/air.png" alt="$AIR Logo" style={{ width: 120, height: 120 }} />
        </button>
        <div className="text-gray-700 text-center mb-2">
          <span className="font-bold text-blue-600">{remaining}</span> points left today
        </div>
        {!canEarnPoints && (
          <div className="text-xs text-gray-500 text-center">You reached the daily limit. Come back tomorrow!</div>
        )}
      </div>
    </div>
  )
} 