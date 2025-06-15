import { useState } from 'react'
import useGameStore from '../store/useGameStore'

export default function LeaderboardModal({ open, onClose }) {
  const leaderboard = useGameStore(s => s.getLeaderboard())
  const [search, setSearch] = useState('')

  if (!open) return null

  const filtered = leaderboard.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-pink-900/95 rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-pink-200 hover:text-white text-2xl font-bold focus:outline-none"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-pink-100 text-center mb-4">Leaderboard</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search username..."
          className="w-full px-4 py-2 mb-4 rounded-lg bg-pink-50 text-pink-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1 px-2 text-pink-200">#</th>
                <th className="py-1 px-2 text-pink-200">Username</th>
                <th className="py-1 px-2 text-pink-200 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={3} className="text-center text-pink-300 py-4">No results</td></tr>
              )}
              {filtered.map((u, i) => (
                <tr key={u.username} className="hover:bg-pink-800/40">
                  <td className="py-1 px-2 font-bold text-pink-100">{leaderboard.findIndex(lb => lb.username === u.username) + 1}</td>
                  <td className="py-1 px-2 text-pink-100">{u.username}</td>
                  <td className="py-1 px-2 text-pink-100 text-right">{u.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 