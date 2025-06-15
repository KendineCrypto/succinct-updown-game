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

  // Generate price movement with random walk (Brownian motion style)
  useEffect(() => {
    if (phase === PHASES.WAIT) {
      if (prices.length === 0) {
        addPrice(1)
      }

      const interval = setInterval(() => {
        const lastPrice = prices[prices.length - 1] || 1

        // Brownian motion: larger random step for sharper movement
        const randomStep = (Math.random() - 0.5) * 0.1 // now 0.1 for more volatility
        let target = lastPrice + randomStep

        // Clamp to min/max
        target = Math.max(0.5, Math.min(1.5, target))

        // Soft transition
        const newPrice = lastPrice + (target - lastPrice) * 0.5
        addPrice(Number(newPrice.toFixed(4)))

        if (getPhaseTimeLeft() === 0) {
          clearInterval(interval)
          startResultPhase()
        }
      }, 50)

      return () => clearInterval(interval)
    }
  }, [phase, prices, addPrice, getPhaseTimeLeft, startResultPhase])

  // Fixed min/max for Y axis
  const minPrice = 0.5
  const maxPrice = 1.5
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

  // Phase label and color (pink theme)
  const phaseInfo = {
    [PHASES.BID]: {
      label: 'Bidding Phase',
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-50 dark:bg-pink-900/20'
    },
    [PHASES.WAIT]: {
      label: 'Chart Phase',
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-900/20'
    },
    [PHASES.RESULT]: {
      label: 'Result',
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-900/20'
    }
  }[phase]

  // Grid lines (pink theme)
  const gridLines = []
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i / 5) * (h - 2 * padding)
    gridLines.push(
      <line
        key={`hgrid-${i}`}
        x1={padding}
        x2={w - padding}
        y1={y}
        y2={y}
        stroke="#EC4899"
        strokeWidth={1}
        opacity={0.1}
      />
    )
  }
  for (let i = 0; i <= 6; i++) {
    const x = padding + (i / 6) * (w - 2 * padding)
    gridLines.push(
      <line
        key={`vgrid-${i}`}
        y1={padding}
        y2={h - padding}
        x1={x}
        x2={x}
        stroke="#EC4899"
        strokeWidth={1}
        opacity={0.1}
      />
    )
  }

  // Y axis price labels
  const yLabels = []
  for (let i = 0; i <= 5; i++) {
    const price = maxPrice - (i / 5) * priceRange
    const y = padding + (i / 5) * (h - 2 * padding)
    yLabels.push(
      <text
        key={`ylabel-${i}`}
        x={12}
        y={y + 4}
        fontSize={16}
        fill="#EC4899"
        className="dark:fill-pink-400"
      >
        ${price.toFixed(2)}
      </text>
    )
  }

  // X axis second labels
  const xLabels = []
  for (let i = 0; i <= 6; i++) {
    const sec = Math.round((i / 6) * (prices.length - 1) / 5)
    const x = padding + (i / 6) * (w - 2 * padding)
    xLabels.push(
      <text
        key={`xlabel-${i}`}
        x={x}
        y={h - 12}
        fontSize={16}
        fill="#EC4899"
        textAnchor="middle"
        className="dark:fill-pink-400"
      >
        {sec}s
      </text>
    )
  }

  return (
    <div className={`rounded-lg shadow-lg p-6 ${phaseInfo.bg} transition-colors duration-500`}>
      <div className="text-center mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${phaseInfo.color}`}>{phaseInfo.label}</h2>
        <div className="text-5xl font-bold text-pink-500">
          {getPhaseTimeLeft()}<span className="text-lg ml-1">s</span>
        </div>
      </div>
      {(phase === PHASES.WAIT || phase === PHASES.RESULT) && (
        <div className="flex flex-col items-center">
          <svg 
            ref={svgRef} 
            width={w} 
            height={h} 
            className="rounded" 
            style={{ 
              display: 'block', 
              background: 'linear-gradient(180deg, #831843 0%, #500724 100%)',
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)'
            }}
          >
            {/* Grid */}
            {gridLines}
            {/* Price line */}
            {prices.length > 1 && (
              <polyline
                points={getPoints()}
                fill="none"
                stroke="#EC4899"
                strokeWidth={2}
                style={{ 
                  filter: 'drop-shadow(0 2px 6px rgba(236, 72, 153, 0.4))',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                }}
              />
            )}
            {/* Locked price line */}
            {lockedPrice && (
              <line
                x1={padding}
                x2={w - padding}
                y1={getLockedY()}
                y2={getLockedY()}
                stroke="#F472B6"
                strokeDasharray="6 4"
                strokeWidth={2}
                opacity={0.7}
              />
            )}
            {/* Current price line */}
            {prices.length > 1 && (
              <line
                x1={getCurrentX()}
                x2={getCurrentX()}
                y1={padding}
                y2={h - padding}
                stroke="#F472B6"
                strokeWidth={2}
                opacity={0.7}
              />
            )}
            {/* Y axis price labels */}
            {yLabels}
            {/* X axis second labels */}
            {xLabels}
          </svg>
          {lockedPrice && (
            <div className="mt-2 text-pink-400 text-xs font-semibold">
              Locked Price: ${lockedPrice.toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 