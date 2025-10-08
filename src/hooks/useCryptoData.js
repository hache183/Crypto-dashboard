import { useState, useEffect, useCallback, useRef } from 'react';
import { coinGeckoService } from '../services/coinGeckoService';
import { snapshotManager } from '../services/snapshotManager';
import { API_CONFIG } from '../constants/config';

export function useCryptoData(limit = 50) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [countdown, setCountdown] = useState(API_CONFIG.REFRESH_INTERVAL / 1000);
  
  // Ref per evitare doppi fetch in strict mode
  const hasFetchedRef = useRef(false);

  // Fetch data function con snapshot
  const fetchCoins = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      if (forceRefresh) {
        coinGeckoService.clearCache();
      }

      // Fetch da API
      const data = await coinGeckoService.getCoinsMarkets({
        per_page: limit,
        page: 1,
      });

      // Salva snapshot PRIMA di processare i dati
      snapshotManager.saveSnapshot(data);

      // Arricchisci i dati con calcoli snapshot
      const enrichedData = data.map(coin => {
        const priceChanges = snapshotManager.calculateAllChanges(
          coin.id,
          coin.current_price
        );

        return {
          ...coin,
          priceChanges, // Aggiungi oggetto con tutte le variazioni
        };
      });

      setCoins(enrichedData);
      setLastUpdate(Date.now());
      setCountdown(API_CONFIG.REFRESH_INTERVAL / 1000);

      // Log stats per debug
      const stats = snapshotManager.getStats();
      console.log('📊 Snapshot Stats:', stats);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch crypto data');
      console.error('❌ Error fetching coins:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Initial fetch (solo una volta, evita doppi fetch in strict mode)
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCoins();
    }
  }, [fetchCoins]);

  // Auto-refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCoins();
    }, API_CONFIG.REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchCoins]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return API_CONFIG.REFRESH_INTERVAL / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchCoins(true);
  }, [fetchCoins]);

  // Get snapshot stats
  const snapshotStats = snapshotManager.getStats();

  return {
    coins,
    loading,
    error,
    lastUpdate,
    countdown,
    refresh,
    snapshotStats, // Esporta stats per debug UI
  };
}