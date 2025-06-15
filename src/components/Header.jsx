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
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight select-none">
          $PROVE Up/Down
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDark(d => !d)}
          className="rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow"
        >
          {dark ? (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#FBBF24"/></svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#2563EB"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </button>
        <div className="bg-white/80 dark:bg-gray-800/80 px-6 py-2 rounded-xl shadow font-semibold text-gray-700 dark:text-gray-200 text-lg">
          <span className="mr-2">Score:</span>
          <span className="text-blue-600 dark:text-blue-400">{score.toLocaleString()}</span>
        </div>
        <button
          onClick={toggleHistory}
          className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow hover:from-blue-600 hover:to-indigo-600 transition-all"
        >
          {showHistory ? 'Place Bet' : 'Show History'}
        </button>
      </div>
    </header>
  )
} 