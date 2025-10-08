/**
 * AlertService - Gestisce alerts per variazioni significative
 */
class AlertService {
  constructor() {
    this.alerts = [];
    this.lastCheck = new Map(); // coinId -> last price checked
  }

  /**
   * Controlla e genera alerts per coins
   */
  checkAlerts(coins, thresholds = { price: 5, volume: 50 }) {
    const newAlerts = [];
    const now = Date.now();

    coins.forEach(coin => {
      // Check variazione prezzo 5m
      const priceChange5m = coin.priceChanges?.['5m'];
      if (priceChange5m !== null && Math.abs(priceChange5m) >= thresholds.price) {
        newAlerts.push({
          id: `${coin.id}-price-${now}`,
          coinId: coin.id,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          type: 'price',
          value: priceChange5m,
          threshold: thresholds.price,
          timestamp: now,
          message: `${coin.symbol.toUpperCase()} ${priceChange5m > 0 ? 'surged' : 'dropped'} ${Math.abs(priceChange5m).toFixed(2)}% in 5 minutes!`,
        });
      }

      // Check volume anomalo
      const volumeVsAvg = coin.volumeVsAvg;
      if (volumeVsAvg !== null && volumeVsAvg >= thresholds.volume) {
        newAlerts.push({
          id: `${coin.id}-volume-${now}`,
          coinId: coin.id,
          coinName: coin.name,
          coinSymbol: coin.symbol,
          type: 'volume',
          value: volumeVsAvg,
          threshold: thresholds.volume,
          timestamp: now,
          message: `${coin.symbol.toUpperCase()} volume spike: ${volumeVsAvg.toFixed(0)}% above average!`,
        });
      }
    });

    // Aggiungi nuovi alerts
    this.alerts = [...newAlerts, ...this.alerts];

    // Mantieni solo ultimi 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }

    if (newAlerts.length > 0) {
      console.log('🚨', newAlerts.length, 'new alerts generated');
    }

    return newAlerts;
  }

  /**
   * Ottieni tutti gli alerts
   */
  getAll() {
    return this.alerts;
  }

  /**
   * Ottieni alerts recenti (ultimi 5 minuti)
   */
  getRecent(minutes = 5) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.alerts.filter(alert => alert.timestamp > cutoff);
  }

  /**
   * Rimuovi alert
   */
  remove(alertId) {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }

  /**
   * Clear tutti gli alerts
   */
  clear() {
    this.alerts = [];
    console.log('🚨 Alerts cleared');
  }
}

// Export singleton
export const alertService = new AlertService();