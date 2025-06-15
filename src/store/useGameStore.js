import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const PHASES = {
  BID: 'BID',
  WAIT: 'WAIT',
  RESULT: 'RESULT'
}

const MIN_BID = 500
const INITIAL_SCORE = 5000

const getInitialUsername = () => {
  try {
    return localStorage.getItem('username') || ''
  } catch {
    return ''
  }
}

const useGameStore = create((set, get) => ({
  // State
  phase: PHASES.BID,
  phaseStartTime: Date.now(),
  lockedPrice: null,
  lastPrice: null,
  prices: [],
  bidAmount: 0,
  bidDirection: null,
  result: null,
  score: INITIAL_SCORE,
  username: getInitialUsername(),
  leaderboard: [],

  // Actions
  setUsername: async (username) => {
    set({ username })
    localStorage.setItem('username', username)
    // Fetch user from Supabase
    const { data, error } = await supabase
      .from('leaderboard')
      .select('score')
      .eq('username', username)
      .single()
    if (data && data.score !== undefined) {
      set({ score: data.score })
    } else {
      // Insert new user
      await supabase.from('leaderboard').insert([{ username, score: INITIAL_SCORE }])
      set({ score: INITIAL_SCORE })
    }
    get().fetchGlobalLeaderboard()
  },

  loadUserScore: async () => {
    const username = get().username
    if (!username) return
    const { data, error } = await supabase
      .from('leaderboard')
      .select('score')
      .eq('username', username)
      .single()
    if (data && data.score !== undefined) {
      set({ score: data.score })
    }
  },

  setScore: async (score) => {
    set({ score })
    const { username } = get()
    if (username) {
      await supabase.from('leaderboard').upsert([{ username, score }], { onConflict: ['username'] })
      get().fetchGlobalLeaderboard()
    }
  },

  fetchGlobalLeaderboard: async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
    if (data) set({ leaderboard: data })
  },

  getLeaderboard: () => {
    return get().leaderboard
  },

  startNewRound: () => {
    set({
      phase: PHASES.BID,
      phaseStartTime: Date.now(),
      lockedPrice: null,
      lastPrice: null,
      prices: [],
      bidAmount: 0,
      bidDirection: null,
      result: null
    })
  },

  setMinBid: (amount = MIN_BID) => {
    set({ bidAmount: amount })
  },

  placeBid: (direction) => {
    if (get().phase !== PHASES.BID) return
    const { bidAmount, score } = get()
    if (bidAmount < MIN_BID || bidAmount > score) return
    const currentPrice = get().prices[get().prices.length - 1] || 1
    set({
      bidDirection: direction,
      phase: PHASES.WAIT,
      phaseStartTime: Date.now(),
      lockedPrice: currentPrice,
      prices: [currentPrice],
      score: score - bidAmount
    })
  },

  addPrice: (price) => {
    set(state => ({
      prices: [...state.prices, price],
      lastPrice: price
    }))
  },

  startResultPhase: () => {
    const { bidDirection, lockedPrice, lastPrice, bidAmount, score, setScore } = get()
    let isWin = false
    if (bidDirection === 'up') {
      isWin = lastPrice > lockedPrice
    } else if (bidDirection === 'down') {
      isWin = lastPrice < lockedPrice
    }
    let newScore = score
    if (isWin) {
      newScore = score + (bidAmount * 2)
    }
    set({
      phase: PHASES.RESULT,
      phaseStartTime: Date.now(),
      result: isWin ? 'WIN' : 'LOSE',
    })
    setScore(newScore)
    setTimeout(() => {
      get().startNewRound()
    }, 15000)
  },

  getPhaseTimeLeft: () => {
    const { phase, phaseStartTime } = get()
    const now = Date.now()
    switch (phase) {
      case PHASES.BID:
        return Math.max(0, Math.ceil((15000 - (now - phaseStartTime)) / 1000))
      case PHASES.WAIT:
        return Math.max(0, Math.ceil((15000 - (now - phaseStartTime)) / 1000))
      case PHASES.RESULT:
        return Math.max(0, Math.ceil((15000 - (now - phaseStartTime)) / 1000))
      default:
        return 0
    }
  }
}))

export default useGameStore 