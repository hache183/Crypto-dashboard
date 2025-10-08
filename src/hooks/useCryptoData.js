import { useState, useEffect, useCallback, useRef } from 'react';
import { coinGeckoService } from '../services/coinGeckoService';
import { snapshotManager } from '../services/snapshotManager';
import { API_CONFIG, FILTER_OPTIONS, DEFAULT_WATCHLIST } from '../constants/config';

export function useCryptoData() {
  const [allCoins, setAllCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [countdown, setCountdown] = useState(API_CONFIG.REFRESH_INTERVAL / 1000);
  
  // Filter states
  const [activeFilter, setActiveFilter] = useState(FILTER_OPTIONS.TOP_50);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });
  
  const hasFetchedRef = useRef(false);

  // Fetch data function
  const fetchCoins = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      if (forceRefresh) {
        coinGeckoService.clearCache();
      }

      // Fetch sempre Top 100 per avere più dati
      const data = await coinGeckoService.getCoinsMarkets({
        per_page: 100,
        page: 1,
      });

      // Salva snapshot
      snapshotManager.saveSnapshot(data);

      // Arricchisci dati con calcoli snapshot
      const enrichedData = data.map(coin => {
        const priceChanges = snapshotManager.calculateAllPriceChanges(
          coin.id,
          coin.current_price
        );

        const volumeChanges = snapshotManager.calculateAllVolumeChanges(
          coin.id,
          coin.total_volume
        );

        const avgVolume24h = snapshotManager.calculateAvgVolume24h(coin.id);
        
        // Volume 5m corrente vs media 24h
        const volumeVsAvg = avgVolume24h 
          ? ((coin.total_volume - avgVolume24h) / avgVolume24h) * 100
          : null;

        return {
          ...coin,
          priceChanges,
          volumeChanges,
          avgVolume24h,
          volumeVsAvg,
        };
      });

      setAllCoins(enrichedData);
      setLastUpdate(Date.now());
      setCountdown(API_CONFIG.REFRESH_INTERVAL / 1000);

      const stats = snapshotManager.getStats();
      console.log('📊 Snapshot Stats:', stats);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch crypto data');
      console.error('❌ Error fetching coins:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allCoins];

    // Apply filter (Top 50 / Top 100 / Watchlist)
    if (activeFilter === FILTER_OPTIONS.TOP_50) {
      result = result.slice(0, 50);
    } else if (activeFilter === FILTER_OPTIONS.TOP_100) {
      result = result.slice(0, 100);
    } else if (activeFilter === FILTER_OPTIONS.WATCHLIST) {
      result = result.filter(coin => DEFAULT_WATCHLIST.includes(coin.id));
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(coin => 
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query) ||
        coin.id.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested values (e.g., priceChanges.5m)
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        // Handle null/undefined
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCoins(result);
  }, [allCoins, activeFilter, searchQuery, sortConfig]);

  // Initial fetch
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

  // Manual refresh
  const refresh = useCallback(() => {
    fetchCoins(true);
  }, [fetchCoins]);

  // Sort function
  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const snapshotStats = snapshotManager.getStats();

  return {
    coins: filteredCoins,
    loading,
    error,
    lastUpdate,
    countdown,
    refresh,
    snapshotStats,
    // Filter controls
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    // Sort controls
    sortConfig,
    requestSort,
  };
}