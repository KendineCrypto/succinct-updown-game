# $AIR Price Prediction Game

Gerçek AIR token fiyatı ile çalışan tahmin oyunu.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Supabase tablosunu oluşturun:
```sql
-- Supabase SQL Editor'da çalıştırın:
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

CREATE INDEX IF NOT EXISTS idx_air_prices_timestamp ON air_prices(timestamp);
CREATE INDEX IF NOT EXISTS idx_air_prices_price_usd ON air_prices(price_usd);
CREATE INDEX IF NOT EXISTS idx_air_prices_recent ON air_prices(timestamp DESC);

ALTER TABLE air_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON air_prices FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON air_prices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

3. Uygulamayı başlatın:
```bash
npm run dev
```

## Özellikler

- ✅ Gerçek AIR token fiyatı (Dexscreener API)
- ✅ Supabase veritabanı entegrasyonu
- ✅ Eski bilgisayar sistemi arayüzü
- ✅ Fiyat geçmişi kaydetme
- ✅ Otomatik fiyat güncelleme (30 saniye)
- ✅ Gerçek zamanlı grafik

## API Kaynakları

- **Dexscreener API**: AIR token fiyat verileri
- **Supabase**: Fiyat geçmişi ve kullanıcı verileri

## Teknolojiler

- React + Vite
- Zustand (State Management)
- Supabase (Database)
- Tailwind CSS
- Dexscreener API 