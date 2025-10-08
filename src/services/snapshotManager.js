import { TIMEFRAMES } from '../constants/config';

/**
 * SnapshotManager - Gestisce gli snapshot temporali di prezzi e volumi
 */
class SnapshotManager {
  constructor() {
    // Mappa: coinId -> array di snapshot
    this.snapshots = new Map();
    
    // Contatore cicli
    this.cycleCount = 0;
    
    // Timestamp dell'ultimo snapshot
    this.lastSnapshotTime = null;
    
    console.log('📸 SnapshotManager initialized');
  }

  /**
   * Salva un nuovo snapshot per tutte le coins (PRICE + VOLUME)
   */
  saveSnapshot(coins) {
    const timestamp = Date.now();
    this.cycleCount++;
    this.lastSnapshotTime = timestamp;

    console.log(`📸 Saving snapshot #${this.cycleCount} at ${new Date(timestamp).toLocaleTimeString()}`);

    coins.forEach(coin => {
      const coinId = coin.id;
      
      if (!this.snapshots.has(coinId)) {
        this.snapshots.set(coinId, []);
      }

      const coinSnapshots = this.snapshots.get(coinId);

      // Snapshot con PRICE e VOLUME
      const snapshot = {
        price: coin.current_price,
        volume: coin.total_volume, // Volume 24h
        timestamp: timestamp,
        cycle: this.cycleCount,
      };

      coinSnapshots.push(snapshot);

      // Mantieni max 2016 snapshot (1 settimana)
      const maxSnapshots = 2016;
      if (coinSnapshots.length > maxSnapshots) {
        coinSnapshots.shift();
      }

      this.snapshots.set(coinId, coinSnapshots);
    });

    console.log(`✅ Snapshot saved for ${coins.length} coins`);
  }

  /**
   * Calcola la variazione percentuale PREZZO per un timeframe
   */
  calculatePriceChange(coinId, currentPrice, timeframeId) {
    const coinSnapshots = this.snapshots.get(coinId);
    
    if (!coinSnapshots || coinSnapshots.length === 0) {
      return null;
    }

    const timeframe = TIMEFRAMES.find(tf => tf.id === timeframeId);
    if (!timeframe) return null;

    const cyclesBack = timeframe.minutes / 5;
    const targetCycle = this.cycleCount - cyclesBack;

    let closestSnapshot = null;
    let minDiff = Infinity;

    for (const snapshot of coinSnapshots) {
      const diff = Math.abs(snapshot.cycle - targetCycle);
      if (diff < minDiff) {
        minDiff = diff;
        closestSnapshot = snapshot;
      }
    }

    if (!closestSnapshot || minDiff > cyclesBack * 0.5) {
      return null;
    }

    const oldPrice = closestSnapshot.price;
    if (oldPrice === 0 || oldPrice === null) return null;

    const change = ((currentPrice - oldPrice) / oldPrice) * 100;
    return change;
  }

  /**
   * Calcola la variazione percentuale VOLUME per un timeframe
   */
  calculateVolumeChange(coinId, currentVolume, timeframeId) {
    const coinSnapshots = this.snapshots.get(coinId);
    
    if (!coinSnapshots || coinSnapshots.length === 0) {
      return null;
    }

    const timeframe = TIMEFRAMES.find(tf => tf.id === timeframeId);
    if (!timeframe) return null;

    const cyclesBack = timeframe.minutes / 5;
    const targetCycle = this.cycleCount - cyclesBack;

    let closestSnapshot = null;
    let minDiff = Infinity;

    for (const snapshot of coinSnapshots) {
      const diff = Math.abs(snapshot.cycle - targetCycle);
      if (diff < minDiff) {
        minDiff = diff;
        closestSnapshot = snapshot;
      }
    }

    if (!closestSnapshot || minDiff > cyclesBack * 0.5) {
      return null;
    }

    const oldVolume = closestSnapshot.volume;
    if (oldVolume === 0 || oldVolume === null) return null;

    const change = ((currentVolume - oldVolume) / oldVolume) * 100;
    return change;
  }

  /**
   * Calcola media volume 24h (ultimi 288 cicli)
   */
  calculateAvgVolume24h(coinId) {
    const coinSnapshots = this.snapshots.get(coinId);
    
    if (!coinSnapshots || coinSnapshots.length === 0) {
      return null;
    }

    // Prendi ultimi 288 snapshot (24h)
    const last24h = coinSnapshots.slice(-288);
    
    if (last24h.length < 10) {
      return null; // Non abbastanza dati
    }

    const sum = last24h.reduce((acc, snap) => acc + (snap.volume || 0), 0);
    return sum / last24h.length;
  }

  /**
   * Calcola tutte le variazioni PREZZO per una coin
   */
  calculateAllPriceChanges(coinId, currentPrice) {
    const changes = {};
    TIMEFRAMES.forEach(timeframe => {
      changes[timeframe.id] = this.calculatePriceChange(coinId, currentPrice, timeframe.id);
    });
    return changes;
  }

  /**
   * Calcola tutte le variazioni VOLUME per una coin
   */
  calculateAllVolumeChanges(coinId, currentVolume) {
    const changes = {};
    TIMEFRAMES.forEach(timeframe => {
      changes[timeframe.id] = this.calculateVolumeChange(coinId, currentVolume, timeframe.id);
    });
    return changes;
  }

  /**
   * Ottieni statistiche snapshot
   */
  getStats() {
    return {
      totalCoins: this.snapshots.size,
      cycleCount: this.cycleCount,
      lastSnapshotTime: this.lastSnapshotTime,
      avgSnapshotsPerCoin: this.snapshots.size > 0
        ? Array.from(this.snapshots.values()).reduce((sum, arr) => sum + arr.length, 0) / this.snapshots.size
        : 0,
    };
  }

  /**
   * Reset completo
   */
  reset() {
    this.snapshots.clear();
    this.cycleCount = 0;
    this.lastSnapshotTime = null;
    console.log('🗑️ SnapshotManager reset');
  }

  /**
   * Verifica se abbiamo dati sufficienti per un timeframe
   */
  hasDataForTimeframe(timeframeId) {
    const timeframe = TIMEFRAMES.find(tf => tf.id === timeframeId);
    if (!timeframe) return false;

    const requiredCycles = timeframe.minutes / 5;
    return this.cycleCount >= requiredCycles;
  }
}

// Export singleton instance
export const snapshotManager = new SnapshotManager();