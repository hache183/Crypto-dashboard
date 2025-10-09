import { TIMEFRAMES } from '../constants/config';
import { persistenceService } from './persistenceService';

/**
 * SnapshotManagerV2 - Versione migliorata con persistenza
 */
class SnapshotManagerV2 {
  constructor() {
    this.snapshots = new Map();
    this.cycleCount = 0;
    this.lastSnapshotTime = null;
    this.failedCycles = 0;
    this.successfulCycles = 0;
    
    this.loadState();
    console.log('📸 SnapshotManagerV2 initialized');
  }

  loadState() {
    try {
      const state = persistenceService.load('snapshots');
      if (state) {
        this.snapshots = new Map(state.snapshots);
        this.cycleCount = state.cycleCount;
        this.lastSnapshotTime = state.lastSnapshotTime;
        this.successfulCycles = state.successfulCycles || 0;
        this.failedCycles = state.failedCycles || 0;
        console.log(`✅ Restored ${this.cycleCount} cycles, ${this.snapshots.size} coins`);
      }
    } catch (error) {
      console.error('❌ Error loading snapshots:', error);
    }
  }

  saveState() {
    try {
      persistenceService.save('snapshots', {
        snapshots: Array.from(this.snapshots.entries()),
        cycleCount: this.cycleCount,
        lastSnapshotTime: this.lastSnapshotTime,
        successfulCycles: this.successfulCycles,
        failedCycles: this.failedCycles,
      });
    } catch (error) {
      console.error('❌ Error saving snapshots:', error);
    }
  }

  saveSnapshot(coins) {
    if (!Array.isArray(coins) || coins.length === 0) {
      this.failedCycles++;
      console.warn('⚠️ Empty coins array, skipping snapshot');
      return;
    }

    const timestamp = Date.now();
    this.cycleCount++;
    this.lastSnapshotTime = timestamp;
    this.successfulCycles++;

    let savedCount = 0;

    coins.forEach(coin => {
      if (!coin.id || !coin.current_price || !coin.total_volume) {
        return;
      }

      if (!this.snapshots.has(coin.id)) {
        this.snapshots.set(coin.id, []);
      }

      const coinSnapshots = this.snapshots.get(coin.id);
      
      coinSnapshots.push({
        price: coin.current_price,
        volume: coin.total_volume,
        timestamp,
        cycle: this.cycleCount,
      });

      // Mantieni max 2016 snapshot (1 settimana)
      const maxSnapshots = 2016;
      if (coinSnapshots.length > maxSnapshots) {
        coinSnapshots.splice(0, coinSnapshots.length - maxSnapshots);
      }

      savedCount++;
    });

    this.saveState();
    
    console.log(`📸 Cycle #${this.cycleCount}: Saved ${savedCount}/${coins.length} coins`);
  }

  calculatePriceChange(coinId, currentPrice, timeframeId) {
    const coinSnapshots = this.snapshots.get(coinId);
    
    if (!coinSnapshots || coinSnapshots.length < 2) {
      return null;
    }

    const timeframe = TIMEFRAMES.find(tf => tf.id === timeframeId);
    if (!timeframe) return null;

    const cyclesBack = Math.floor(timeframe.minutes / 5);
    if (cyclesBack === 0) return null;

    const targetCycle = this.cycleCount - cyclesBack;

    // Trova snapshot più vicino
    let closestSnapshot = null;
    let minDiff = Infinity;

    for (const snapshot of coinSnapshots) {
      const diff = Math.abs(snapshot.cycle - targetCycle);
      if (diff < minDiff) {
        minDiff = diff;
        closestSnapshot = snapshot;
      }
    }

    // Tolleranza: max 20% di differenza nei cicli
    const tolerance = Math.max(1, cyclesBack * 0.2);
    if (!closestSnapshot || minDiff > tolerance) {
      return null;
    }

    const oldPrice = closestSnapshot.price;
    if (!oldPrice || oldPrice === 0) return null;

    return ((currentPrice - oldPrice) / oldPrice) * 100;
  }

  calculateAllPriceChanges(coinId, currentPrice) {
    const changes = {};
    TIMEFRAMES.forEach(tf => {
      changes[tf.id] = this.calculatePriceChange(coinId, currentPrice, tf.id);
    });
    return changes;
  }

  calculateAvgVolume24h(coinId) {
    const coinSnapshots = this.snapshots.get(coinId);
    
    if (!coinSnapshots || coinSnapshots.length < 10) {
      return null;
    }

    // Ultimi 288 snapshot (24h a 5min/ciclo)
    const last24h = coinSnapshots.slice(-288);
    const sum = last24h.reduce((acc, snap) => acc + (snap.volume || 0), 0);
    return sum / last24h.length;
  }

  getStats() {
    return {
      totalCoins: this.snapshots.size,
      cycleCount: this.cycleCount,
      successfulCycles: this.successfulCycles,
      failedCycles: this.failedCycles,
      lastSnapshotTime: this.lastSnapshotTime,
      avgSnapshotsPerCoin: this.snapshots.size > 0
        ? Array.from(this.snapshots.values()).reduce((sum, arr) => sum + arr.length, 0) / this.snapshots.size
        : 0,
      dataQuality: this.cycleCount > 0 
        ? ((this.successfulCycles / this.cycleCount) * 100).toFixed(1) 
        : '0',
    };
  }

  hasMinimumData(timeframeId) {
    const timeframe = TIMEFRAMES.find(tf => tf.id === timeframeId);
    if (!timeframe) return false;
    
    const requiredCycles = Math.floor(timeframe.minutes / 5);
    return this.cycleCount >= requiredCycles;
  }

  reset() {
    this.snapshots.clear();
    this.cycleCount = 0;
    this.lastSnapshotTime = null;
    this.failedCycles = 0;
    this.successfulCycles = 0;
    this.saveState();
    console.log('🗑️ SnapshotManager reset');
  }
}

export const snapshotManager = new SnapshotManagerV2();