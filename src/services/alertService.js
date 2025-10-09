/**
 * AlertServiceV2 - Sistema alert migliorato con deduplicazione
 */

const ALERT_THRESHOLDS = {
  PRICE_CHANGE_5M: 5,
  PRICE_CHANGE_15M: 8,
  VOLUME_SPIKE: 50,
  VOLUME_DROP: -30,
};

class AlertServiceV2 {
  constructor() {
    this.alerts = [];
    this.maxAlerts = 50;
    this.notifiedAlerts = new Set();
  }

  checkAlerts(coins) {
    const newAlerts = [];
    const now = Date.now();

    coins.forEach(coin => {
      // Alert per variazione 5m significativa
      const change5m = coin.priceChanges?.['5m'];
      if (change5m !== null && Math.abs(change5m) >= ALERT_THRESHOLDS.PRICE_CHANGE_5M) {
        const alertId = `${coin.id}-5m-${Math.floor(now / 60000)}`;
        
        if (!this.notifiedAlerts.has(alertId)) {
          newAlerts.push({
            id: alertId,
            coinId: coin.id,
            coinName: coin.name,
            coinSymbol: coin.symbol,
            type: 'price_5m',
            value: change5m,
            timestamp: now,
            severity: Math.abs(change5m) > 10 ? 'high' : 'medium',
            message: `${coin.symbol.toUpperCase()} ${change5m > 0 ? '🚀' : '💥'} ${Math.abs(change5m).toFixed(2)}% in 5m`,
          });
          
          this.notifiedAlerts.add(alertId);
        }
      }

      // Alert per variazione 15m significativa
      const change15m = coin.priceChanges?.['15m'];
      if (change15m !== null && Math.abs(change15m) >= ALERT_THRESHOLDS.PRICE_CHANGE_15M) {
        const alertId = `${coin.id}-15m-${Math.floor(now / 300000)}`;
        
        if (!this.notifiedAlerts.has(alertId)) {
          newAlerts.push({
            id: alertId,
            coinId: coin.id,
            coinName: coin.name,
            coinSymbol: coin.symbol,
            type: 'price_15m',
            value: change15m,
            timestamp: now,
            severity: Math.abs(change15m) > 15 ? 'high' : 'medium',
            message: `${coin.symbol.toUpperCase()} ${change15m > 0 ? '📈' : '📉'} ${Math.abs(change15m).toFixed(2)}% in 15m`,
          });
          
          this.notifiedAlerts.add(alertId);
        }
      }

      // Alert volume anomalo
      const volumeVsAvg = coin.volumeVsAvg;
      if (volumeVsAvg !== null) {
        if (volumeVsAvg >= ALERT_THRESHOLDS.VOLUME_SPIKE) {
          const alertId = `${coin.id}-vol-high-${Math.floor(now / 300000)}`;
          
          if (!this.notifiedAlerts.has(alertId)) {
            newAlerts.push({
              id: alertId,
              coinId: coin.id,
              coinName: coin.name,
              coinSymbol: coin.symbol,
              type: 'volume_high',
              value: volumeVsAvg,
              timestamp: now,
              severity: volumeVsAvg > 100 ? 'high' : 'medium',
              message: `${coin.symbol.toUpperCase()} 🔥 Volume spike: +${volumeVsAvg.toFixed(0)}%`,
            });
            
            this.notifiedAlerts.add(alertId);
          }
        } else if (volumeVsAvg <= ALERT_THRESHOLDS.VOLUME_DROP) {
          const alertId = `${coin.id}-vol-low-${Math.floor(now / 300000)}`;
          
          if (!this.notifiedAlerts.has(alertId)) {
            newAlerts.push({
              id: alertId,
              coinId: coin.id,
              coinName: coin.name,
              coinSymbol: coin.symbol,
              type: 'volume_low',
              value: volumeVsAvg,
              timestamp: now,
              severity: 'low',
              message: `${coin.symbol.toUpperCase()} 🧊 Volume drop: ${volumeVsAvg.toFixed(0)}%`,
            });
            
            this.notifiedAlerts.add(alertId);
          }
        }
      }
    });

    if (newAlerts.length > 0) {
      this.alerts = [...newAlerts, ...this.alerts].slice(0, this.maxAlerts);
      console.log(`🚨 ${newAlerts.length} new alerts generated`);
    }

    // Cleanup vecchie notifiche (oltre 1 ora)
    const cutoff = now - 3600000;
    this.notifiedAlerts = new Set(
      Array.from(this.notifiedAlerts).filter(id => {
        const parts = id.split('-');
        const timestamp = parseInt(parts[parts.length - 1]);
        return timestamp > cutoff / 60000; // Converti a minuti
      })
    );

    return newAlerts;
  }

  getRecent(minutes = 15) {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.alerts.filter(alert => alert.timestamp > cutoff);
  }

  getAll() {
    return this.alerts;
  }

  clear() {
    this.alerts = [];
    this.notifiedAlerts.clear();
    console.log('🚨 Alerts cleared');
  }

  getStats() {
    return {
      totalAlerts: this.alerts.length,
      recentAlerts: this.getRecent(15).length,
      highSeverity: this.alerts.filter(a => a.severity === 'high').length,
      mediumSeverity: this.alerts.filter(a => a.severity === 'medium').length,
      lowSeverity: this.alerts.filter(a => a.severity === 'low').length,
    };
  }
}

export const alertService = new AlertServiceV2();