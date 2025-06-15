import { useState } from 'react'
import useGameStore from '../store/useGameStore'

export default function Bid() {
  const { placeBid, getPhaseTimeLeft, score, bidAmount, setMinBid } = useGameStore()
  const [localAmount, setLocalAmount] = useState('')

  const handleBid = (direction) => {
    if (!bidAmount || bidAmount < 500) return
    placeBid(direction)
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    setLocalAmount(value)
    if (value && !isNaN(value)) {
      setMinBid(Number(value))
    }
  }

  return (
    <div className="bg-pink-900/20 rounded-lg p-6 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pink-200 mb-2">Place Your Bid</h2>
        <div className="text-5xl font-bold text-pink-500">
          {getPhaseTimeLeft()}<span className="text-lg ml-1">s</span>
        </div>
        <div className="mt-2 text-pink-200">
          Your Score: <span className="font-bold text-pink-400">{score}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="amount" className="text-pink-200 font-medium">
            Bid Amount (Score)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              id="amount"
              value={localAmount}
              onChange={handleAmountChange}
              min="500"
              step="100"
              placeholder="Enter amount..."
              className="flex-1 bg-pink-950/50 border border-pink-700 rounded-lg px-4 py-2 text-white placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="button"
              onClick={() => {
                setMinBid()
                setLocalAmount('500')
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Min (500)
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleBid('up')}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            Bid UP
          </button>
          <button
            type="button"
            onClick={() => handleBid('down')}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            Bid DOWN
          </button>
        </div>
      </div>
    </div>
  )
} 