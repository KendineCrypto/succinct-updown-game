import { useEffect, useState } from 'react'
import useGameStore from '../store/useGameStore'

export default function Header() {
  const { score, showHistory, toggleHistory } = useGameStore()
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight select-none font-mono">
          $AIR Up/Down
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDark(d => !d)}
          className="retro-btn-square"
        >
          {dark ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#FBBF24"/></svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#2563EB"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </button>
        <div className="bg-white/90 dark:bg-gray-800/90 px-6 py-2 rounded shadow font-semibold text-gray-700 dark:text-gray-200 text-lg border border-gray-300">
          <span className="mr-2">Score:</span>
          <span className="text-blue-600 dark:text-blue-400">{score.toLocaleString()}</span>
        </div>
        <button
          onClick={toggleHistory}
          className="retro-btn"
        >
          {showHistory ? 'Place Bet' : 'Show History'}
        </button>
      </div>
    </header>
  )
} 