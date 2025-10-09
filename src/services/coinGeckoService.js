import { API_CONFIG } from '../constants/config';

class CoinGeckoService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.requestCache = new Map();
    this.cacheTimeout = 30000; // 30 secondi cache
    
    // ✅ Tracking statistiche
    this.requestCount = 0;
    this.errorCount = 0;
    this.lastError = null;
    this.lastRequestTime = null;
  }

  /**
   * Fetch coins market data con caching e tracking
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

      this.lastRequestTime = Date.now();
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

      // ✅ Update stats
      this.requestCount++;
      this.lastError = null; // Clear error on success

      console.log(`✅ Fetched ${data.length} coins (Request #${this.requestCount})`);
      return data;

    } catch (error) {
      // ✅ Track errors
      this.errorCount++;
      this.lastError = error.message;
      
      console.error('❌ CoinGecko API Error:', error);
      console.error(`   Total errors: ${this.errorCount}/${this.requestCount} requests`);
      
      throw error;
    }
  }

  /**
   * ✅ Get service statistics
   */
  getStats() {
    return {
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      successRate: this.requestCount > 0 
        ? ((this.requestCount - this.errorCount) / this.requestCount * 100).toFixed(1)
        : '0',
      lastError: this.lastError,
      cacheSize: this.requestCache.size,
      lastRequestTime: this.lastRequestTime,
    };
  }

  /**
   * Clear cache (utile per force refresh)
   */
  clearCache() {
    this.requestCache.clear();
    console.log('🗑️ Cache cleared');
  }

  /**
   * ✅ Reset all stats
   */
  resetStats() {
    this.requestCount = 0;
    this.errorCount = 0;
    this.lastError = null;
    this.lastRequestTime = null;
    console.log('🗑️ Stats reset');
  }
}

// Export singleton instance
export const coinGeckoService = new CoinGeckoService();