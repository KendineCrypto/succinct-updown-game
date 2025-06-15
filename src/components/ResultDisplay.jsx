import useGameStore from '../store/useGameStore'

export default function ResultDisplay() {
  const { result } = useGameStore()

  if (!result) return null

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-8 text-center max-w-lg mx-auto mt-8 flex flex-col gap-6">
      <h2 className={`text-2xl font-bold mb-2 ${result.won ? 'text-green-600' : 'text-red-600'}`}>
        {result.won ? '🎉 Congratulations!' : '😔 You Lost'}
      </h2>
      <div className="text-4xl font-extrabold mb-2">
        {result.won ? (
          <span className="text-green-600">+{result.reward} ⭐</span>
        ) : (
          <span className="text-red-600">Lost</span>
        )}
      </div>
      <div className="text-gray-500 dark:text-gray-300 text-lg">
        Final $PROVE Price: <span className="font-bold text-gray-700 dark:text-gray-100">${result.finalPrice.toFixed(2)}</span>
      </div>
      <div className="text-gray-500 dark:text-gray-300 text-base">
        Total Stars Won: <span className="font-bold text-blue-600 dark:text-blue-400">{result.totalStars} ⭐</span>
      </div>
      {result.winners.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50/80 dark:bg-blue-900/40 rounded-xl">
          <h3 className="font-bold text-gray-700 dark:text-gray-100 mb-2">Winners</h3>
          <div className="space-y-2">
            {result.winners.map((winner, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-200">
                  {winner.direction === 'UP' ? '🔼 Up' : '🔽 Down'} {winner.amount.toLocaleString()} Points
                </span>
                <span className="font-bold text-green-600">
                  +{winner.reward} ⭐
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
      >
        New Bet
      </button>
    </div>
  )
} 