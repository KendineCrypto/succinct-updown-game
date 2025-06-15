import { useState } from 'react'
import useGameStore from '../store/useGameStore'

export default function UsernameModal() {
  const { setUsername, username } = useGameStore()
  const [input, setInput] = useState('')

  if (username) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim().length < 2) return
    setUsername(input.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <form onSubmit={handleSubmit} className="bg-pink-900/90 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 min-w-[320px] max-w-xs">
        <h2 className="text-2xl font-bold text-pink-200 text-center">Enter your Twitter username</h2>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="@kullaniciadi"
          className="px-4 py-3 rounded-lg bg-pink-50 text-pink-900 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
          minLength={2}
          maxLength={32}
          required
        />
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 shadow-md text-lg"
        >
          Continue
        </button>
      </form>
    </div>
  )
} 