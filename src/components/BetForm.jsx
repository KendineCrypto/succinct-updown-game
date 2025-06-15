import { useState } from 'react'
import useGameStore from '../store/useGameStore'

export default function BetForm() {
  const { score, placeBid, phase } = useGameStore()
  const [betAmount, setBetAmount] = useState(500)
  const [direction, setDirection] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!direction || betAmount < 500 || betAmount > score) return
    placeBid({
      direction,
      amount: betAmount,
      lockedPrice: null // lockedPrice store tarafından atanacak
    })
    setDirection(null)
    setBetAmount(500)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-8 max-w-lg mx-auto flex flex-col gap-8">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">$PROVE Price</h2>
        <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 select-none">
          {/* Fiyat grafik fazında gösteriliyor */}
          <span className="text-base font-medium text-gray-400 dark:text-gray-500">(Live on chart)</span>
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          onClick={() => setDirection('UP')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all shadow border-2
            ${direction === 'UP'
              ? 'bg-gradient-to-r from-green-400 to-blue-400 text-white border-green-400 scale-105'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900'}`}
        >
          🔼 Up
        </button>
        <button
          type="button"
          onClick={() => setDirection('DOWN')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all shadow border-2
            ${direction === 'DOWN'
              ? 'bg-gradient-to-r from-red-400 to-pink-400 text-white border-red-400 scale-105'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900'}`}
        >
          🔽 Down
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Bet Amount</label>
        <input
          type="number"
          min="500"
          max={score}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:focus:ring-blue-600 dark:focus:border-blue-600 text-lg transition-all shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
        />
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Min: 500 | Max: {score.toLocaleString()}</p>
      </div>
      <button
        type="submit"
        disabled={!direction || betAmount < 500 || betAmount > score || phase !== 'bid'}
        className="w-full py-3 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
      >
        Place Bet
      </button>
    </form>
  )
} 