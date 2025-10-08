// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.coingecko.com/api/v3',
  ENDPOINTS: {
    COINS_MARKETS: '/coins/markets',
  },
  DEFAULT_CURRENCY: 'usd',
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minuti in millisecondi
};

// Supported Timeframes con configurazione aggiornamento
export const TIMEFRAMES = [
  { id: '3m', label: '3m', minutes: 3, updateEvery: 1 },      // aggiorna ogni ciclo
  { id: '5m', label: '5m', minutes: 5, updateEvery: 1 },      // aggiorna ogni ciclo
  { id: '15m', label: '15m', minutes: 15, updateEvery: 3 },   // aggiorna ogni 3 cicli (15min)
  { id: '30m', label: '30m', minutes: 30, updateEvery: 6 },   // aggiorna ogni 6 cicli (30min)
  { id: '45m', label: '45m', minutes: 45, updateEvery: 9 },   // aggiorna ogni 9 cicli (45min)
  { id: '1h', label: '1h', minutes: 60, updateEvery: 12 },    // aggiorna ogni 12 cicli (1h)
  { id: '2h', label: '2h', minutes: 120, updateEvery: 24 },   // aggiorna ogni 24 cicli (2h)
  { id: '4h', label: '4h', minutes: 240, updateEvery: 48 },   // aggiorna ogni 48 cicli (4h)
  { id: '6h', label: '6h', minutes: 360, updateEvery: 72 },   // aggiorna ogni 72 cicli (6h)
  { id: '12h', label: '12h', minutes: 720, updateEvery: 144 }, // aggiorna ogni 144 cicli (12h)
  { id: '18h', label: '18h', minutes: 1080, updateEvery: 216 }, // aggiorna ogni 216 cicli (18h)
  { id: '24h', label: '24h', minutes: 1440, updateEvery: 288 }, // aggiorna ogni 288 cicli (24h)
  { id: '3d', label: '3D', minutes: 4320, updateEvery: 864 },  // aggiorna ogni 864 cicli (3 giorni)
  { id: '1w', label: '1W', minutes: 10080, updateEvery: 2016 }, // aggiorna ogni 2016 cicli (1 settimana)
];

// Helper per ottenere timeframe by ID
export const getTimeframeById = (id) => {
  return TIMEFRAMES.find(tf => tf.id === id);
};

// Filter Options
export const FILTER_OPTIONS = {
  TOP_50: 50,
  TOP_100: 100,
  WATCHLIST: 'watchlist',
};

// Default watchlist coins (CoinGecko IDs)
export const DEFAULT_WATCHLIST = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'ripple',
  'cardano',
  'solana',
  'polkadot',
  'dogecoin',
];