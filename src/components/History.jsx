import useGameStore from '../store/useGameStore'

export default function History() {
  const { history, showHistory } = useGameStore()

  if (!showHistory) return null

  return (
    <div className="mt-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-6">Bet History</h2>
      {history.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-center py-8 text-lg">No bets yet</p>
      ) : (
        <div className="space-y-4">
          {history.map((bet, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-900/60 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl ${
                  bet.direction === 'UP' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {bet.direction === 'UP' ? '🔼' : '🔽'}
                </span>
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-100">
                    {bet.direction === 'UP' ? 'Up' : 'Down'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Locked Price: ${bet.lockedPrice?.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  bet.result === 'Kazandı' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {bet.result === 'Kazandı' ? 'Won' : 'Lost'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {bet.amount.toLocaleString()} Points
                </p>
                {bet.reward > 0 && (
                  <p className="text-xs text-green-600">
                    +{bet.reward} ⭐
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Total: {bet.totalStars} ⭐
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 