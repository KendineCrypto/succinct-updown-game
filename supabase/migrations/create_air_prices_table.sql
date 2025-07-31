-- AIR fiyat verilerini saklamak için tablo
CREATE TABLE IF NOT EXISTS air_prices (
  id SERIAL PRIMARY KEY,
  price_usd DECIMAL(20, 8) NOT NULL,
  price_eth DECIMAL(20, 12) NOT NULL,
  change_24h DECIMAL(10, 4),
  volume_24h DECIMAL(20, 2),
  liquidity_usd DECIMAL(20, 2),
  market_cap DECIMAL(20, 2),
  fdv DECIMAL(20, 2),
  pair_address TEXT,
  dex_id TEXT,
  url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler ekleyelim
CREATE INDEX IF NOT EXISTS idx_air_prices_timestamp ON air_prices(timestamp);
CREATE INDEX IF NOT EXISTS idx_air_prices_price_usd ON air_prices(price_usd);

-- Son 24 saatteki fiyatları hızlı çekmek için
CREATE INDEX IF NOT EXISTS idx_air_prices_recent ON air_prices(timestamp DESC);

-- RLS (Row Level Security) aktif edelim
ALTER TABLE air_prices ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir ama sadece authenticated user'lar yazabilir
CREATE POLICY "Allow public read access" ON air_prices FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON air_prices FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 