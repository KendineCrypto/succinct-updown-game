import useGameStore from '../store/useGameStore'

export default function EarnPointsModal({ open, onClose }) {
  const earnPoints = useGameStore(s => s.earnPoints)
  const canEarnPoints = useGameStore(s => s.canEarnPoints)()
  const dailyEarnedPoints = useGameStore(s => s.dailyEarnedPoints)

  if (!open) return null

  const remaining = 5000 - dailyEarnedPoints

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-pink-900/95 rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-xs w-full relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-pink-200 hover:text-white text-2xl font-bold focus:outline-none"
        >×</button>
        <h2 className="text-2xl font-bold text-pink-100 text-center mb-4">Earn Points</h2>
        <div className="mb-4 text-pink-200 text-center">
          Click the $PROVE logo to earn <span className="font-bold text-pink-300">+500</span> points!<br/>
          <span className="text-xs">(Max 5000 per day)</span>
        </div>
        <button
          onClick={canEarnPoints ? earnPoints : undefined}
          disabled={!canEarnPoints}
          className={`transition-all duration-200 ${canEarnPoints ? 'hover:scale-110 active:scale-95' : 'opacity-40 cursor-not-allowed'}`}
          style={{ outline: 'none', border: 'none', background: 'none', marginBottom: 16 }}
        >
          <img src="/logo.svg" alt="$PROVE Logo" style={{ width: 120, height: 120 }} />
        </button>
        <div className="text-pink-200 text-center mb-2">
          <span className="font-bold text-pink-300">{remaining}</span> points left today
        </div>
        {!canEarnPoints && (
          <div className="text-xs text-pink-400 text-center">You reached the daily limit. Come back tomorrow!</div>
        )}
      </div>
    </div>
  )
} 