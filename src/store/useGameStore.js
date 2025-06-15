import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const PHASES = {
  BID: 'BID',
  WAIT: 'WAIT',
  RESULT: 'RESULT'
}

const MIN_BID = 500
const INITIAL_SCORE = 5000

const getToday = () => new Date().toISOString().slice(0, 10)
const EARN_LIMIT = 5000
const EARN_AMOUNT = 500

const getInitialUsername = () => {
  try {
    return localStorage.getItem('username') || ''
  } catch {
    return ''
  }
}

const getInitialEarn = () => {
  try {
    const data = JSON.parse(localStorage.getItem('earnPoints') || '{}')
    return {
      dailyEarnedPoints: data.date === getToday() ? data.points : 0,
      lastEarnDate: data.date === getToday() ? data.date : getToday(),
    }
  } catch {
    return { dailyEarnedPoints: 0, lastEarnDate: getToday() }
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
  ...getInitialEarn(),

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
      await get().fetchGlobalLeaderboard()
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

  startResultPhase: async () => {
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
    await setScore(newScore)
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
  },

  earnPoints: async () => {
    const { dailyEarnedPoints, score, username } = get()
    if (dailyEarnedPoints >= EARN_LIMIT) return
    const newEarned = dailyEarnedPoints + EARN_AMOUNT > EARN_LIMIT ? EARN_LIMIT : dailyEarnedPoints + EARN_AMOUNT
    const newScore = score + EARN_AMOUNT
    set({ dailyEarnedPoints: newEarned, score: newScore, lastEarnDate: getToday() })
    localStorage.setItem('earnPoints', JSON.stringify({ date: getToday(), points: newEarned }))
    if (username) {
      await supabase.from('leaderboard').upsert([{ username, score: newScore }], { onConflict: ['username'] })
      await get().fetchGlobalLeaderboard()
    }
  },

  canEarnPoints: () => {
    const { dailyEarnedPoints } = get()
    return dailyEarnedPoints < EARN_LIMIT
  },

  resetEarnIfNeeded: () => {
    const today = getToday()
    const { lastEarnDate } = get()
    if (lastEarnDate !== today) {
      set({ dailyEarnedPoints: 0, lastEarnDate: today })
      localStorage.setItem('earnPoints', JSON.stringify({ date: today, points: 0 }))
    }
  }
}))

export default useGameStore 