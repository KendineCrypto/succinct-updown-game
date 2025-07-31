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
      <form onSubmit={handleSubmit} className="retro-panel p-8 flex flex-col gap-6 min-w-[320px] max-w-xs">
        <div className="retro-panel-header mb-4">
          <h2 className="text-xl font-bold text-center">Enter your Twitter username</h2>
        </div>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="@kullaniciadi"
          className="retro-input"
          minLength={2}
          maxLength={32}
          required
        />
        <button
          type="submit"
          className="retro-btn-large"
        >
          Continue
        </button>
      </form>
    </div>
  )
} 