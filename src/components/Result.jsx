import { useEffect, useState } from 'react'
import useGameStore from '../store/useGameStore'

// Animated confetti burst (CSS)
function ConfettiBurst() {
  // 10 konfeti parçası, rastgele renk ve pozisyon
  const confetti = Array.from({length: 12}).map((_, i) => {
    const colors = ['#F472B6', '#EC4899', '#F9A8D4', '#fff', '#A21CAF']
    const left = Math.random() * 80 + 10 // %10 - %90 arası
    const delay = Math.random() * 0.5
    const size = Math.random() * 16 + 12
    const color = colors[Math.floor(Math.random() * colors.length)]
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: '-30px',
          width: size,
          height: size,
          background: color,
          borderRadius: '50%',
          opacity: 0.85,
          animation: `confetti-fall 1.2s cubic-bezier(.6,.4,.4,1) ${delay}s forwards`
        }}
      />
    )
  })
  return (
    <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:10}}>
      {confetti}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          80% { opacity: 0.85; }
          100% { transform: translateY(220px) scale(0.7) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function Result() {
  const { lockedPrice, lastPrice, getPhaseTimeLeft, result } = useGameStore()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (result === 'WIN') {
      setShowConfetti(true)
      const timeout = setTimeout(() => setShowConfetti(false), 1500)
      return () => clearTimeout(timeout)
    } else {
      setShowConfetti(false)
    }
  }, [result])

  return (
    <div className="bg-pink-900/20 rounded-lg p-6 shadow-lg relative overflow-visible">
      {showConfetti && <ConfettiBurst />}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pink-200 mb-2">Round Result</h2>
        <div className="text-5xl font-bold text-pink-500">
          {getPhaseTimeLeft()}<span className="text-lg ml-1">s</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-pink-950/50 rounded-lg">
          <span className="text-pink-200">Locked Price:</span>
          <span className="text-pink-400 font-bold">${lockedPrice?.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-pink-950/50 rounded-lg">
          <span className="text-pink-200">Final Price:</span>
          <span className="text-pink-400 font-bold">${lastPrice?.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-pink-950/50 rounded-lg">
          <span className="text-pink-200">Result:</span>
          <span className={`font-bold ${result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
            {result === 'WIN' ? 'WIN' : 'LOSE'}
          </span>
        </div>
      </div>
    </div>
  )
} 