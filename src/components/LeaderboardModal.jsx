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
      <div className="retro-panel p-8 min-w-[340px] max-w-md w-full relative">
        <button
          onClick={onClose}
          className="retro-btn-square absolute top-4 right-4"
          style={{ zIndex: 60 }}
        >
          ×
        </button>
        <div className="retro-panel-header mb-4">
          <h2 className="text-xl font-bold text-center">Leaderboard</h2>
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search username..."
          className="retro-input w-full mb-4"
        />
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1 px-2 text-gray-700 font-bold">#</th>
                <th className="py-1 px-2 text-gray-700 font-bold">Username</th>
                <th className="py-1 px-2 text-gray-700 font-bold text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={3} className="text-center text-gray-500 py-4">No results</td></tr>
              )}
              {filtered.map((u, i) => (
                <tr key={u.username} className="hover:bg-gray-100">
                  <td className="py-1 px-2 font-bold text-gray-700">{leaderboard.findIndex(lb => lb.username === u.username) + 1}</td>
                  <td className="py-1 px-2 text-gray-700">{u.username}</td>
                  <td className="py-1 px-2 text-gray-700 text-right">{u.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 