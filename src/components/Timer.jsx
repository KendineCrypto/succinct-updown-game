import { useEffect, useRef, useState } from 'react'
import useGameStore, { PHASES } from '../store/useGameStore'

export default function Timer() {
  const {
    phase,
    getPhaseTimeLeft,
    prices,
    lockedPrice,
    addPrice,
    startResultPhase
  } = useGameStore()
  
  const svgRef = useRef(null)
  const [direction, setDirection] = useState(1) // 1 for up, -1 for down
  const [lastDirectionChange, setLastDirectionChange] = useState(Date.now())

  // Chart dimensions (larger)
  const w = 600
  const h = 300
  const padding = 40

  // Generate price movement with Brownian motion (orijinal $PROVE sistemi)
  useEffect(() => {
    if (phase === PHASES.WAIT) {
      if (prices.length === 0) {
        // İlk fiyatı 0.009787'den başlat
        addPrice(0.009787)
      }

      const interval = setInterval(() => {
        const lastPrice = prices[prices.length - 1] || 0.009787

        // Brownian motion: 0.0001 civarında değişim
        const randomStep = (Math.random() - 0.5) * 0.0002 // -0.0001 ile +0.0001 arası
        let target = lastPrice + randomStep

        // Clamp to min/max (0.008 - 0.012 arası)
        target = Math.max(0.008, Math.min(0.012, target))

        // Soft transition (orijinal sistem gibi)
        const newPrice = lastPrice + (target - lastPrice) * 0.5
        addPrice(Number(newPrice.toFixed(6)))

        if (getPhaseTimeLeft() === 0) {
          clearInterval(interval)
          startResultPhase()
        }
      }, 50) // Her 50ms güncelle (orijinal sistem gibi)

      return () => clearInterval(interval)
    }
  }, [phase, prices, addPrice, getPhaseTimeLeft, startResultPhase])

  // Fixed min/max for Y axis (0.008 - 0.012 arası)
  const minPrice = 0.008
  const maxPrice = 0.012
  const priceRange = maxPrice - minPrice

  // Polyline points (linear)
  const getPoints = () => {
    if (prices.length < 2) return ''
    return prices.map((price, i) => {
      const x = padding + (i / (prices.length - 1)) * (w - 2 * padding)
      const y = padding + (h - 2 * padding) - ((price - minPrice) / priceRange) * (h - 2 * padding)
      return `${x},${y}`
    }).join(' ')
  }

  // Locked price line
  const getLockedY = () => {
    if (!lockedPrice) return 0
    return padding + (h - 2 * padding) - ((lockedPrice - minPrice) / priceRange) * (h - 2 * padding)
  }

  // Last price line
  const getCurrentX = () => {
    if (prices.length < 2) return 0
    return padding + ((prices.length - 1) / (prices.length - 1)) * (w - 2 * padding)
  }

  // Grid lines (retro theme)
  const gridLines = []
  for (let i = 0; i <= 10; i++) {
    const y = padding + (i / 10) * (h - 2 * padding)
    gridLines.push(
      <line
        key={`grid-${i}`}
        x1={padding}
        y1={y}
        x2={w - padding}
        y2={y}
        stroke="#e0e0e0"
        strokeWidth="1"
      />
    )
  }

  return (
    <div className="retro-panel p-6">
      <div className="retro-panel-header mb-4">
        <h2 className="text-xl font-bold">Live AIR Price Chart</h2>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-gray-700 mb-2">
          {getPhaseTimeLeft()}<span className="text-lg ml-1">s</span>
        </div>
        <div className="text-gray-600">
          Current AIR Price: <span className="font-bold text-blue-600">
            ${prices[prices.length - 1]?.toFixed(6) || '0.009787'}
          </span>
        </div>
        {lockedPrice && (
          <div className="text-gray-600">
            Locked Price: <span className="font-bold text-green-600">
              ${lockedPrice.toFixed(6)}
            </span>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="bg-white border-2 border-gray-400 p-4 mb-4">
        <svg
          ref={svgRef}
          width={w}
          height={h}
          className="w-full h-auto"
          style={{ maxWidth: '100%' }}
        >
          {/* Grid lines */}
          {gridLines}
          
          {/* Y-axis labels */}
          {[0.008, 0.009, 0.010, 0.011, 0.012].map((price) => {
            const y = padding + (h - 2 * padding) - ((price - minPrice) / priceRange) * (h - 2 * padding)
            return (
              <text
                key={`y-${price}`}
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#666"
              >
                ${price.toFixed(4)}
              </text>
            )
          })}
          
          {/* Price line */}
          {prices.length >= 2 && (
            <polyline
              points={getPoints()}
              fill="none"
              stroke="#0066cc"
              strokeWidth="2"
            />
          )}
          
          {/* Locked price line */}
          {lockedPrice && (
            <line
              x1={padding}
              y1={getLockedY()}
              x2={w - padding}
              y2={getLockedY()}
              stroke="#22c55e"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
          
          {/* Current price indicator */}
          {prices.length >= 2 && (
            <circle
              cx={getCurrentX()}
              cy={padding + (h - 2 * padding) - ((prices[prices.length - 1] - minPrice) / priceRange) * (h - 2 * padding)}
              r="4"
              fill="#0066cc"
            />
          )}
        </svg>
      </div>

      {/* Price History */}
      <div className="bg-gray-50 border border-gray-300 p-4">
        <h3 className="font-bold text-gray-700 mb-2">Recent AIR Prices:</h3>
        <div className="text-sm text-gray-600 font-mono">
          {prices.slice(-10).map((price, i) => (
            <span key={i} className="mr-2">
              ${price.toFixed(6)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
} 