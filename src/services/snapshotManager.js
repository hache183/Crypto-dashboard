import { TIMEFRAMES } from '../constants/config';

/**
 * SnapshotManager - Gestisce gli snapshot temporali dei prezzi
 * 
 * Strategia:
 * - Ogni 5 minuti salva un nuovo snapshot
 * - Mantiene snapshot diversi per timeframes diversi
 * - Aggiorna snapshot in base alla frequenza configurata
 */
class SnapshotManager {
  constructor() {
    // Mappa: coinId -> array di snapshot
    this.snapshots = new Map();
    
    // Contatore cicli per determinare quando aggiornare ogni timeframe
    this.cycleCount = 0;
    
    // Timestamp dell'ultimo snapshot
    this.lastSnapshotTime = null;
    
    console.log('📸 SnapshotManager initialized');
  }

  /**
   * Salva un nuovo snapshot per tutte le coins
   * @param {Array} coins - Array di oggetti coin da CoinGecko API
   */
  saveSnapshot(coins) {
    const timestamp = Date.now();
    this.cycleCount++;
    this.lastSnapshotTime = timestamp;

    console.log(`📸 Saving snapshot #${this.cycleCount} at ${new Date(timestamp).toLocaleTimeString()}`);

    coins.forEach(coin => {
      const coinId = coin.id;
      
      // Inizializza array di snapshot per questa coin se non esiste
      if (!this.snapshots.has(coinId)) {
        this.snapshots.set(coinId, []);
      }

      const coinSnapshots = this.snapshots.get(coinId);

      // Crea snapshot con prezzo e timestamp
      const snapshot = {
        price: coin.current_price,
        timestamp: timestamp,
        cycle: this.cycleCount,
      };

      // Aggiungi snapshot
      coinSnapshots.push(snapshot);

      // Mantieni solo snapshot necessari (ultimi 2016 cicli = 1 settimana)
      // Questo previene memory leak
      const maxSnapshots = 2016; // 1 settimana di cicli a 5 minuti
      if (coinSnapshots.length > maxSnapshots) {
        coinSnapshots.shift(); // rimuovi il più vecchio
      }

      this.snapshots.set(coinId, coinSnapshots);
    });

    console.log(`✅ Snapshot saved for ${coins.length} coins (${this.snapshots.size} total tracked)`);
  }

  /**
   * Calcola la variazione percentuale per un timeframe specifico
   * @param {string} coinId - ID della coin
   * @param {number} currentPrice - Prezzo attuale
   * @param {string} timeframeId - ID del timeframe (es: '5m', '1h')
   * @returns {number|null} - Variazione percentuale o null se non disponibile
   */
  calculateChange(coinId, currentPrice, timeframeId) {
    const coinSnapshots = this.snapshots.get(coinId);
    
    if (!coinSnapshots || coinSnapshots.length === 0) {
      return null; // Nessuno snapshot disponibile
    }

    const timeframe = TIMEFRAMES.find(tf => tf.id === timeframeId);
    if (!timeframe) {
      console.warn(`⚠️ Timeframe ${timeframeId} not found`);
      return null;
    }

    // Calcola quanti cicli indietro dobbiamo andare
    const cyclesBack = timeframe.minutes / 5; // ogni ciclo è 5 minuti
    const targetCycle = this.cycleCount - cyclesBack;

    // Trova lo snapshot più vicino al target
    let closestSnapshot = null;
    let minDiff = Infinity;

    for (const snapshot of coinSnapshots) {
      const diff = Math.abs(snapshot.cycle - targetCycle);
      if (diff < minDiff) {
        minDiff = diff;
        closestSnapshot = snapshot;
      }
    }

    // Se non troviamo snapshot abbastanza vecchi, return null
    if (!closestSnapshot || minDiff > cyclesBack * 0.5) {
      return null; // Snapshot non abbastanza accurato
    }

    // Calcola variazione percentuale
    const oldPrice = closestSnapshot.price;
    if (oldPrice === 0 || oldPrice === null) return null;

    const change = ((currentPrice - oldPrice) / oldPrice) * 100;
    return change;
  }

  /**
   * Calcola tutte le variazioni per una coin
   * @param {string} coinId - ID della coin
   * @param {number} currentPrice - Prezzo attuale
   * @returns {Object} - Oggetto con tutte le variazioni per timeframe
   */
  calculateAllChanges(coinId, currentPrice) {
    const changes = {};

    TIMEFRAMES.forEach(timeframe => {
      changes[timeframe.id] = this.calculateChange(coinId, currentPrice, timeframe.id);
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
   * Reset completo (utile per debug)
   */
  reset() {
    this.snapshots.clear();
    this.cycleCount = 0;
    this.lastSnapshotTime = null;
    console.log('🗑️ SnapshotManager reset');
  }

  /**
   * Verifica se abbiamo dati sufficienti per un timeframe
   * @param {string} timeframeId 
   * @returns {boolean}
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