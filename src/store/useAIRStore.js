import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { getAIRPrice } from '../utils/getAIRPrice'

const useAIRStore = create((set, get) => ({
  // State
  airPrice: null,
  loading: false,
  error: null,
  lastUpdated: null,
  priceHistory: [],
  
  // Actions
  fetchAIRPrice: async () => {
    set({ loading: true, error: null })
    try {
      const priceData = await getAIRPrice()
      if (priceData) {
        set({ 
          airPrice: priceData, 
          loading: false, 
          lastUpdated: new Date().toISOString(),
          error: null 
        })
        
        // Supabase'e kaydet
        await get().saveToSupabase(priceData)
      } else {
        set({ 
          loading: false, 
          error: 'AIR fiyat verisi alınamadı' 
        })
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error.message || 'Bir hata oluştu' 
      })
    }
  },

  saveToSupabase: async (priceData) => {
    try {
      const { error } = await supabase
        .from('air_prices')
        .insert([{
          price_usd: priceData.priceUSD,
          price_eth: priceData.priceETH,
          change_24h: priceData.change24h,
          volume_24h: priceData.volume24h,
          liquidity_usd: priceData.liquidityUSD,
          market_cap: priceData.marketCap,
          fdv: priceData.fdv,
          pair_address: priceData.pairAddress,
          dex_id: priceData.dexId,
          url: priceData.url
        }])
      
      if (error) {
        console.error('Supabase kayıt hatası:', error)
      }
    } catch (error) {
      console.error('Supabase kayıt hatası:', error)
    }
  },

  fetchPriceHistory: async (hours = 24) => {
    try {
      const { data, error } = await supabase
        .from('air_prices')
        .select('*')
        .gte('timestamp', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: true })
      
      if (error) {
        console.error('Fiyat geçmişi çekme hatası:', error)
        return []
      }
      
      set({ priceHistory: data || [] })
      return data
    } catch (error) {
      console.error('Fiyat geçmişi çekme hatası:', error)
      return []
    }
  },

  startPricePolling: () => {
    // İlk veriyi çek
    get().fetchAIRPrice()
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(() => {
      get().fetchAIRPrice()
    }, 30000)
    
    return () => clearInterval(interval)
  },

  getFormattedPrice: () => {
    const { airPrice } = get()
    if (!airPrice) return { usd: '0.00', eth: '0.00', change: '0.00' }
    
    return {
      usd: airPrice.priceUSD?.toFixed(6) || '0.00',
      eth: airPrice.priceETH?.toFixed(8) || '0.00',
      change: airPrice.change24h?.toFixed(2) || '0.00'
    }
  },

  getFormattedVolume: () => {
    const { airPrice } = get()
    if (!airPrice?.volume24h) return '0'
    
    if (airPrice.volume24h >= 1000000) {
      return `${(airPrice.volume24h / 1000000).toFixed(2)}M`
    } else if (airPrice.volume24h >= 1000) {
      return `${(airPrice.volume24h / 1000).toFixed(2)}K`
    } else {
      return airPrice.volume24h.toFixed(2)
    }
  },

  getFormattedMarketCap: () => {
    const { airPrice } = get()
    if (!airPrice?.marketCap) return '0'
    
    if (airPrice.marketCap >= 1000000) {
      return `$${(airPrice.marketCap / 1000000).toFixed(2)}M`
    } else if (airPrice.marketCap >= 1000) {
      return `$${(airPrice.marketCap / 1000).toFixed(2)}K`
    } else {
      return `$${airPrice.marketCap.toFixed(2)}`
    }
  },

  // Oyun için olasılık tabanlı fiyat hareketi
  getCurrentPriceForGame: () => {
    const { airPrice } = get()
    
    // Mevcut AIR fiyatını baz al (0.009787)
    const basePrice = airPrice?.priceUSD || 0.009787
    
    // Fiyatı 0.5-1.5 aralığına normalize et
    // 0.009787 -> 1.0 civarında olacak şekilde
    const normalizedPrice = (basePrice * 100) + 0.5
    
    return Math.max(0.5, Math.min(1.5, normalizedPrice))
  },

  // Her 0.1 saniyede smooth fiyat hareketi
  getNextPrice: (currentPrice) => {
    // 0.009787 fiyatını baz al
    const basePrice = 0.009787
    
    // Her 0.1 saniyede yeni olasılık hesapla
    const randomValue = Math.random() // 0-1 arası
    
    // Olasılık dağılımı:
    // %50 ihtimalle artış
    // %50 ihtimalle azalış
    const isIncrease = randomValue > 0.5
    
    // Daha küçük değişim miktarı (smooth için)
    const changeAmount = 0.00005 + (Math.random() * 0.0001) // 0.00005 - 0.00015 arası
    
    // Yeni AIR fiyatı hesapla
    let newAIRPrice = basePrice
    if (isIncrease) {
      newAIRPrice = basePrice + changeAmount
    } else {
      newAIRPrice = basePrice - changeAmount
    }
    
    // Negatif fiyat olmasın
    newAIRPrice = Math.max(0.001, newAIRPrice)
    
    // Oyun fiyatına normalize et
    const normalizedPrice = (newAIRPrice * 100) + 0.5
    
    // Smooth geçiş için mevcut fiyatla karıştır
    const smoothFactor = 0.3 // %30 yeni fiyat, %70 mevcut fiyat
    const smoothPrice = (normalizedPrice * smoothFactor) + (currentPrice * (1 - smoothFactor))
    
    // 0.5-1.5 aralığında tut
    return Math.max(0.5, Math.min(1.5, smoothPrice))
  }
}))

export default useAIRStore 