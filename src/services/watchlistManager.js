/**
 * WatchlistManager - Gestisce watchlist personalizzata
 * Usa memoria invece di localStorage (non supportato in artifacts)
 */
class WatchlistManager {
  constructor() {
    // Default watchlist
    this.watchlist = new Set([
      'bitcoin',
      'ethereum',
      'binancecoin',
      'ripple',
      'cardano',
      'solana',
      'polkadot',
      'dogecoin',
    ]);

    console.log('⭐ WatchlistManager initialized with', this.watchlist.size, 'coins');
  }

  /**
   * Aggiungi coin alla watchlist
   */
  add(coinId) {
    this.watchlist.add(coinId);
    console.log('⭐ Added', coinId, 'to watchlist');
    return true;
  }

  /**
   * Rimuovi coin dalla watchlist
   */
  remove(coinId) {
    const removed = this.watchlist.delete(coinId);
    if (removed) {
      console.log('⭐ Removed', coinId, 'from watchlist');
    }
    return removed;
  }

  /**
   * Toggle coin in watchlist
   */
  toggle(coinId) {
    if (this.has(coinId)) {
      this.remove(coinId);
      return false;
    } else {
      this.add(coinId);
      return true;
    }
  }

  /**
   * Verifica se coin è in watchlist
   */
  has(coinId) {
    return this.watchlist.has(coinId);
  }

  /**
   * Ottieni tutte le coins in watchlist
   */
  getAll() {
    return Array.from(this.watchlist);
  }

  /**
   * Conta coins in watchlist
   */
  count() {
    return this.watchlist.size;
  }

  /**
   * Clear watchlist
   */
  clear() {
    this.watchlist.clear();
    console.log('⭐ Watchlist cleared');
  }

  /**
   * Import watchlist da array
   */
  import(coinIds) {
    this.watchlist = new Set(coinIds);
    console.log('⭐ Imported watchlist with', this.watchlist.size, 'coins');
  }

  /**
   * Export watchlist come JSON
   */
  exportJSON() {
    return JSON.stringify(this.getAll(), null, 2);
  }
}

// Export singleton
export const watchlistManager = new WatchlistManager();