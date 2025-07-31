// Dexscreener API'den AIR token fiyat verilerini çekmek için
export const getAIRPrice = async () => {
  try {
    // AIR token contract address: 0xd277b8bef27af6c2dc0a8aeddd23a57637892270
    const response = await fetch('https://api.dexscreener.com/latest/dex/tokens/0xd277b8bef27af6c2dc0a8aeddd23a57637892270');
    const data = await response.json();
    
    if (data.pairs && data.pairs.length > 0) {
      // En yüksek likiditeye sahip pair'i al
      const pair = data.pairs[0];
      
      return {
        priceUSD: parseFloat(pair.priceUsd),
        priceETH: parseFloat(pair.priceNative),
        change24h: parseFloat(pair.priceChange.h24),
        volume24h: parseFloat(pair.volume.h24),
        liquidityUSD: parseFloat(pair.liquidity.usd),
        marketCap: parseFloat(pair.marketCap),
        fdv: parseFloat(pair.fdv),
        pairAddress: pair.pairAddress,
        dexId: pair.dexId,
        url: pair.url,
        timestamp: pair.timestamp
      };
    }
    
    throw new Error('AIR token verisi bulunamadı');
  } catch (error) {
    console.error('AIR fiyat verisi çekilirken hata:', error);
    return null;
  }
};

// Geçmiş fiyat verilerini çekmek için (opsiyonel)
export const getAIRPriceHistory = async (timeframe = '1h') => {
  try {
    // Dexscreener'ın geçmiş veri endpoint'i (varsa)
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/0xd277b8bef27af6c2dc0a8aeddd23a57637892270?timeframe=${timeframe}`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('AIR geçmiş fiyat verisi çekilirken hata:', error);
    return null;
  }
}; 