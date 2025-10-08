import { API_CONFIG } from '../constants/config';

class CoinGeckoService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.requestCache = new Map();
    this.cacheTimeout = 30000; // 30 secondi cache
  }

  /**
   * Fetch coins market data con caching
   */
  async getCoinsMarkets(params = {}) {
    const {
      vs_currency = API_CONFIG.DEFAULT_CURRENCY,
      order = 'market_cap_desc',
      per_page = 100,
      page = 1,
      sparkline = false,
      price_change_percentage = '24h',
    } = params;

    const cacheKey = `markets_${vs_currency}_${per_page}_${page}`;
    
    // Check cache
    if (this.requestCache.has(cacheKey)) {
      const cached = this.requestCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('📦 Using cached data');
        return cached.data;
      }
    }

    try {
      const url = new URL(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.COINS_MARKETS}`
      );
      
      url.searchParams.append('vs_currency', vs_currency);
      url.searchParams.append('order', order);
      url.searchParams.append('per_page', per_page);
      url.searchParams.append('page', page);
      url.searchParams.append('sparkline', sparkline);
      url.searchParams.append('price_change_percentage', price_change_percentage);

      console.log('🌐 Fetching from API:', url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      this.requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      console.log(`✅ Fetched ${data.length} coins`);
      return data;

    } catch (error) {
      console.error('❌ CoinGecko API Error:', error);
      throw error;
    }
  }

  /**
   * Clear cache (utile per force refresh)
   */
  clearCache() {
    this.requestCache.clear();
    console.log('🗑️ Cache cleared');
  }
}

// Export singleton instance
export const coinGeckoService = new CoinGeckoService();