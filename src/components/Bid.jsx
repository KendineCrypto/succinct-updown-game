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
    <div className="retro-panel p-6">
      <div className="retro-panel-header mb-4">
        <h2 className="text-xl font-bold">Place Your Bid</h2>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-700 mb-2">
          {getPhaseTimeLeft()}<span className="text-lg ml-1">s</span>
        </div>
        <div className="text-gray-600">
          Your Score: <span className="font-bold text-blue-600">{score}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="amount" className="text-gray-700 font-medium">
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
              className="retro-input flex-1"
              required
            />
            <button
              type="button"
              onClick={() => {
                setMinBid()
                setLocalAmount('500')
              }}
              className="retro-btn-flat"
            >
              Min (500)
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleBid('up')}
            className="retro-btn-large flex-1"
          >
            Bid UP
          </button>
          <button
            type="button"
            onClick={() => handleBid('down')}
            className="retro-btn-large flex-1"
          >
            Bid DOWN
          </button>
        </div>
      </div>
    </div>
  )
} 